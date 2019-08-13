import os
import logging

import jinja2
import webapp2


class BaseHandler(webapp2.RequestHandler):
  def __init__(self, request, response):
    self.initialize(request, response)

    template_path = os.path.dirname(__file__) + '/../templates'  # Hack: Path to Jinja templates folder relative to this file
    self.jinja = jinja2.Environment(
      loader=jinja2.FileSystemLoader(template_path),
      extensions=['jinja2.ext.autoescape'],
      autoescape=True
    )
