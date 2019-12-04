from ctypes import windll

from mss import mss

from .game import Game

windll.user32.SetProcessDPIAware()

class Capture:
    '''
    Captures images from a game instance
    '''

    CROP_MARGIN = {
        'top': 65,
        'right': 15,
        'bottom': 15,
        'left': 15,
    }

    def __init__(self, game: Game):
        self.game = game
        self.region = self._get_game_region()
        self.mss = mss()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exception_type, exception_value, traceback):
        self.close()
    
    def _get_game_region(self):
        reg = self.game.get_window_region()
        crop = Capture.CROP_MARGIN

        reg['top'] += crop['top']
        reg['left'] += crop['left']
        reg['width'] -= crop['left'] + crop['right']
        reg['height'] -= crop['top'] + crop['bottom']

        return reg
    
    def capture(self):
        '''
        Returns image of game
        '''
        return self.mss.grab(self.region)
    
    def close(self):
        self.mss.close()