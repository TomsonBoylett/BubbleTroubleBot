import sys

import numpy as np
import cv2 as cv

from bot.capture import Capture
from bot.game import Game

def main(args=None):
    with Game() as game:
        with Capture(game) as capture:
            stream_game(capture)

def stream_game(cap: Capture):
    while True:
        image = np.array(cap.capture())

        # Display the picture
        cv.imshow("OpenCV/Numpy normal", image)

        # Press "q" to quit
        if cv.waitKey(15) & 0xFF == ord("q"):
            cv.destroyAllWindows()
            break

if __name__ == "__main__":
    main(sys.argv[1:])