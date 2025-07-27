import unittest
from scripts.server import CustomHTTPRequestHandler

class TestCustomHTTPRequestHandler(unittest.TestCase):
    def test_guess_type_markdown(self):
        # create an instance without invoking __init__
        handler = CustomHTTPRequestHandler.__new__(CustomHTTPRequestHandler)
        self.assertEqual(handler.guess_type('example.md'), 'text/markdown')

if __name__ == '__main__':
    unittest.main()
