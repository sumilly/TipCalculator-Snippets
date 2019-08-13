from py.handlers.base import BaseHandler


class MainHandler(BaseHandler):
  def get(self):
    template = self.jinja.get_template('index.html')
    self.response.write(template.render({}))


ROUTES = [
  ('/', MainHandler),
]
