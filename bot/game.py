import subprocess
import os
import time

import win32gui
import win32con

class Game:
    '''

    Handles the start and stop of the game and gets information
    about the game window.

    '''
    
    FLASH_WIN_NAME = 'Adobe Flash Player 32'
    FLASH_PATH = os.path.join(os.path.dirname(__file__), '../bin/flashplayer_32_sa.exe')
    BUB_TRUB_PATH = os.path.join(os.path.dirname(__file__), '../bin/Bubble Trouble.swf')

    WIN_POLL_RATE = 0.25

    def __init__(self):
        self.proc = subprocess.Popen([Game.FLASH_PATH, Game.BUB_TRUB_PATH])
        self.win_hwnd = self._wait_for_window()
        self._win_always_on_top()

    def __enter__(self):
        return self
    
    def __exit__(self, exception_type, exception_value, traceback):
        self.close()

    def _wait_for_window(self):
        '''
        Waits for game window to exist and returns
        the window handle
        '''
        while True:
            win = win32gui.FindWindow(None, 'Adobe Flash Player 32')

            if win != 0:
                break

            time.sleep(Game.WIN_POLL_RATE)
        return win
    
    def _win_always_on_top(self):
        region = self.get_window_region()
        region = (region['top'], region['left'], region['width'], region['height'])
        win32gui.SetWindowPos(self.win_hwnd, win32con.HWND_TOPMOST, *region, 0)
    
    def get_window_region(self):
        '''
        Returns the location and size of the game window
        '''
        left, top, right, bottom = win32gui.GetWindowRect(self.win_hwnd)

        reg = {
            'left': left,
            'top': top,
            'width': right - left,
            'height': bottom - top,
        }

        return reg
    
    def close(self):
        '''
        Stops the Bubble Trouble Instance
        '''
        self.proc.terminate()
