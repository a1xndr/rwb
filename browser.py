#!/usr/bin/env python
import Queue
import time
import thread
from simplejson import dumps as to_json
from simplejson import loads as from_json
import sys
import gtk
import webkit
import cairo
import gobject

import signal
import os
import commands

DEFAULT_URL = './HTMLdesk/desktop.html' # Change this as you Wish
if(len(sys.argv)>1):
    DEFAULT_URL = sys.argv[1] # Change this as you Wish

class Global(object):
    quit = False
    @classmethod
    def set_quit(cls, *args, **kwargs):
        cls.quit = True

#GTK BS
def asynchronous_gtk_message(fun):
    def worker((function, args, kwargs)):
        apply(function, args, kwargs)

    def fun2(*args, **kwargs):
        gobject.idle_add(worker, (fun, args, kwargs))

    return fun2

def synchronous_gtk_message(fun):

    class NoResult: pass

    def worker((R, function, args, kwargs)):
        R.result = apply(function, args, kwargs)

    def fun2(*args, **kwargs):
        class R: result = NoResult
        gobject.idle_add(worker, (R, fun, args, kwargs))
        while R.result is NoResult: time.sleep(0.01)
        return R.result

    return fun2
class SimpleBrowser: # needs GTK, Python, Webkit-GTK
    def __init__(self, echo=True):
        #self.window = gtk.Window()
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.window.set_type_hint(gtk.gdk.WINDOW_TYPE_HINT_DESKTOP)
        #self.window.set_position(gtk.WIN_POS_CENTER_ALWAYS)
        self.window.set_title("HTML_ROOTWINDOW")
        self.window.connect('delete_event', self.close_application)
        self.window.set_default_size(2560, 1440)
        vbox = gtk.VBox(spacing=0)
        vbox.set_border_width(0)
        self.txt_url = gtk.Entry()
        self.txt_url.connect('activate', self._txt_url_activate)
        self.scrolled_window = gtk.ScrolledWindow()
        self.webview = webkit.WebView()
        self.webview.get_settings().set_property("enable-webgl", True)
        self.scrolled_window.add(self.webview)
        vbox.pack_start(self.scrolled_window, fill=True, expand=True)
        self.window.add(vbox)
        message_queue = Queue.Queue()
        self.echo=True
        self.show();
    def _txt_url_activate(self, entry):
        self._load(entry.get_text())
    def _load(self, url):
        self.webview.open(url)
    def open(self, url):
        self.txt_url.set_text(url)
        self.window.set_title('%s' % url)
        self._load(url)
    def show(self):
        self.window.show_all()
    def close_application(self, widget, event, data=None):
        gtk.main_quit()
    def web_send(self, msg):
        if self.echo: print '<<<', msg
        asynchronous_gtk_message(self.webview.execute_script)(msg)
    def web_recv():
        if message_queue.empty():
            return None
        else:
            msg = message_queue.get()
            if echo: print '>>>', msg
            return msg
    def on_clicked(self, widget):
                gtk.main_quit()


if __name__ == '__main__': # <-- this line is optional
    gtk.gdk.threads_init()
    thread.start_new_thread(gtk.main, ())
    if len(sys.argv) > 1:
        url = os.path.abspath(sys.argv[1])
    else:
        url = os.path.abspath(DEFAULT_URL)
    browser = synchronous_gtk_message(SimpleBrowser)()
    #browser.show()  
    synchronous_gtk_message(browser.open)(url)
    running=True;
    currentDesktop=commands.getstatusoutput('wmctrl -d | gawk \'{if ($2 == "*") print $1+1}\'')
    existWindows=1;
    while running:
        if commands.getstatusoutput('wmctrl -d | gawk \'{if ($2 == "*") print $1+1}\'')!=currentDesktop:
            currentDesktop=commands.getstatusoutput('wmctrl -d | gawk \'{if ($2 == "*") print $1+1}\'')
            synchronous_gtk_message(browser.web_send)('changeWorkspace('+currentDesktop[1]+')')
            
        if not commands.getoutput('wmctrl -l | gawk \'{if ($2+1 ==\"'+currentDesktop[1]+ '\") print $2}\''): 
            if(existWindows==0):
                existWindows=1
                synchronous_gtk_message(browser.web_send)('switchDisplayMode(\'focused\')')
        else:
            if(existWindows!=0):
                existWindows=0
                synchronous_gtk_message(browser.web_send)('switchDisplayMode(\'unfocused\')')
            time.sleep(0.3)
    #    #browser.web_send('document.getElementById("body").innerHTML="xdxdxdxdxdxdxd"')

