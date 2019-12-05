import os
import math

import cv2 as cv
import numpy as np

class Bot:
    '''
    This object takes as input a stream of images from the game
    and outputs a player move
    '''

    BALL_COLOR_RANGES = [
        [ # Yellow
            (0, 154, 182),
            (200, 255, 255)
        ],
        [ # Green
            (39, 96, 57),
            (196, 234, 204)
        ],
        [ # Orange
            (0, 91, 173),
            (212, 255, 255)
        ]
    ]

    ALIEN_COLORS = [
        [
            (94, 88, 223),
            (101, 96, 226)
        ],
        [
            (0, 0, 0),
            (50, 50, 50)
        ]
    ]

    MAIN_GAME_REGION = {
        'top': 0.02,
        'bottom': 0.826,
        'left': 0.005,
        'right': 0.995,
    }

    def __init__(self):
        pass

    def _thinness(self, contour):
        area = cv.contourArea(contour)
        circum = cv.arcLength(contour, True)
        if circum == 0:
            return 0
        return (4 * math.pi * area) / (circum**2)

    def _crop(self, image):
        h, w = image.shape[:2]
        reg = Bot.MAIN_GAME_REGION

        x1 = int(reg['left'] * w)
        y1 = int(reg['top'] * h)
        
        x2 = int(reg['right'] * w)
        y2 = int(reg['bottom'] * h)

        return image[y1:y2, x1:x2]

    def _contour_center(self, contour):
        m = cv.moments(contour)
        x = int(m["m10"] / m["m00"])
        y = int(m["m01"] / m["m00"])

        return (x, y)

    def get_move(self, image):
        cropped = self._crop(image)

        alien = np.zeros(cropped.shape[:2], dtype=np.uint8)
        for color in Bot.ALIEN_COLORS:
            alien_part = cv.inRange(cropped, color[0], color[1])
            alien = cv.bitwise_or(alien, alien_part)

        alien = cv.dilate(alien, cv.getStructuringElement(cv.MORPH_RECT, (5, 5)))
        alien = 255 - alien

        contours = []
        for ball_color in Bot.BALL_COLOR_RANGES:
            thresh = cv.inRange(cropped, ball_color[0], ball_color[1])
            thresh = cv.bitwise_and(thresh, alien)

            new_cnts, _ = cv.findContours(thresh, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
            contours += new_cnts

        contours = [cv.convexHull(c) for c in contours]
        contours = [c for c in contours if self._thinness(c) > 0.9]

        balls = np.zeros(cropped.shape[:2], dtype=np.uint8)
        for i in range(len(contours)):
            balls = cv.drawContours(balls, contours, i, 255, cv.FILLED)
        
        '''
        lab = cv.cvtColor(cropped, cv.COLOR_BGR2LAB)

        mask = np.zeros(cropped.shape[:2], dtype=np.uint8)
        for c in Bot.BALL_COLOR_RANGES:
            mask = cv.bitwise_or(mask, cv.inRange(lab, c[0], c[1]))

        balls = cv.bitwise_and(balls, balls, mask=mask)
        '''
        
        cv.imshow('canny', balls)
        return ''