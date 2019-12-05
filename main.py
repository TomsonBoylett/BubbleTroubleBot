import sys

import numpy as np
import cv2 as cv

from bot.capture import Capture
from bot.game import Game
from bot.bot import Bot

def main(args=None):
    with Game() as game:
        with Capture(game) as capture:
            stream_game(capture)

def stream_game(cap: Capture):
    bot = Bot()
    while True:
        image = np.array(cap.capture())[:, :, :3]

        bot.get_move(image)

        # Display the picture
        cv.imshow("OpenCV/Numpy normal", image)

        # Press "q" to quit
        if cv.waitKey(15) & 0xFF == ord("q"):
            cv.destroyAllWindows()
            break

if __name__ == "__main__":
    main(sys.argv[1:])