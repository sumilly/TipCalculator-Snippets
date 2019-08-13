import webapp2

from py.handlers.main import ROUTES

app = webapp2.WSGIApplication(ROUTES, debug=True)
