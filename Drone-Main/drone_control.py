# !/usr/bin/env python
# -*- coding: utf-8 -*-

"""
© Copyright 2015-2016, 3D Robotics.
drone_delivery.py:

A CherryPy based web application that displays a mapbox map to let you view the current vehicle position and send the vehicle commands to fly to a particular latitude and longitude.

Full documentation is provided at http://python.dronekit.io/examples/drone_delivery.html
"""

from __future__ import print_function
import os
import simplejson
import time
import math
from dronekit import connect, VehicleMode, LocationGlobal, LocationGlobalRelative
import cherrypy
from jinja2 import Environment, FileSystemLoader

# Set up option parsing to get connection string
import argparse
parser = argparse.ArgumentParser(description='Creates a CherryPy based web application that displays a mapbox map to let you view the current vehicle position and send the vehicle commands to fly to a particular latitude and longitude. Will start and connect to SITL if no connection string specified.')
parser.add_argument('--connect',
                    help="vehicle connection target string. If not specified, SITL is automatically started and used.")
args = parser.parse_args()

connection_string = "tcp:127.0.0.1:5760"

# Start SITL if no connection string specified


if not connection_string:
    import dronekit_sitl
    sitl = dronekit_sitl.start_default()
    connection_string = sitl.connection_string()

local_path = os.path.dirname(os.path.abspath(__file__))
print("local path: %s" % local_path)


cherrypy_conf = {
    '/': {
        'tools.sessions.on': True,
        'tools.staticdir.root': local_path
    },
    '/static': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': './html/assets'
    }
}

class Drone(object):
    def __init__(self, server_enabled=True):
        self.gps_lock = False
        self.altitude = 5.0
        # Connect to the Vehicle
        self._log('Connected to vehicle.')
        self.vehicle = vehicle
        self.commands = self.vehicle.commands
        self.home_coords = None
        self.current_coords = []
        self.webserver_enabled = server_enabled
        self._log("DroneDelivery Start")

        # Register observers
        self.vehicle.add_attribute_listener('location', self.location_callback)
        self.set_home_coords()

    def set_home_coords(self):
        # Attempt to obtain home_coords
        while self.home_coords is None:
            if self.vehicle.location.global_frame.lat is not None and \
                    self.vehicle.location.global_frame.lon is not None:
                self.home_coords = [self.vehicle.location.global_frame.lat,
                                    self.vehicle.location.global_frame.lon,
                                    self.altitude]
                print("Home coordinates are : ", self.home_coords)
            else:
                time.sleep(1)  # Wait for 1 second before retrying
                print("Retrying to get home coordinates...")

    def launch(self):
        self._log("Waiting for location...")
        while self.vehicle.location.global_frame.lat == 0:
            time.sleep(0.1)
        self.home_coords = [self.vehicle.location.global_frame.lat,
                            self.vehicle.location.global_frame.lon,
                            self.altitude]
        print("home_coords updated:  ",self.home_coords)
        self._log("Waiting for ability to arm...")
        while not self.vehicle.is_armable:
            time.sleep(.1)

        self._log('Running initial boot sequence')
        self.change_mode('GUIDED')
        self.arm()
        self.takeoff()       

    def takeoff(self):
        self._log("Taking off")
        self.vehicle.simple_takeoff(5.0)

    def arm(self, value=True):
        if value:
            self._log('Waiting for arming...')
            self.vehicle.armed = True
            while not self.vehicle.armed:
                time.sleep(.1)
        else:
            self._log("Disarming!")
            self.vehicle.armed = False

    def change_mode(self, mode):
        self._log("Changing to mode: {0}".format(mode))

        self.vehicle.mode = VehicleMode(mode)
        print(self.vehicle.mode.name)
        while self.vehicle.mode.name != mode:
            self._log('  ... polled mode: {0}'.format(mode))
            time.sleep(1)

    def goto(self, location, relative=None):
        self._log("Goto: {0}, {1}".format(location, self.altitude))

        if relative:
            self.vehicle.simple_goto(
                LocationGlobalRelative(
                    float(location[0]), float(location[1]),
                    float(self.altitude)
                )
            )
        else:
            self.vehicle.simple_goto(
                LocationGlobal(
                    float(location[0]), float(location[1]),
                    float(self.altitude)
                )
            )
        self.vehicle.flush()

    def get_location(self):
        return [vehicle.location.global_frame.lat, vehicle.location.global_frame.lon]

    def distance_from_home(self):
        current_location = vehicle.location.global_relative_frame
        distance_from_takeoff = get_distance_metres(
            LocationGlobalRelative(self.home_coords[0], self.home_coords[1], self.home_coords[2]),
            current_location
        )
        return round(distance_from_takeoff,2)
    
    def change_altitude(self,altitude):
        if(vehicle.mode.name == 'GUIDED' and vehicle.armed == True):
            print(self.home_coords)
            targetlocation=LocationGlobalRelative(self.vehicle.location.global_frame.lat,
                                                  self.vehicle.location.global_frame.lon,
                                                  float(altitude))
            print(targetlocation)
            # vehicle.commands.goto(loc) # send command
            vehicle.simple_goto(targetlocation)
            self.altitude=altitude
            print(LocationGlobalRelative(self.vehicle.location.global_frame.lat,
                                        self.vehicle.location.global_frame.lon,
                                        self.vehicle.location.global_frame.alt))
            vehicle.flush() #make sure it gets sent
        else:
            print("Not armed or in GUIDED mode")

    def location_callback(self, vehicle, name, location):
        if location.global_relative_frame.alt is not None:
            self.altitude = location.global_relative_frame.alt

        self.current_location = location.global_relative_frame
    
    def _log(self, message):
        print("[DEBUG]: {0}".format(message))

class Templates:
    def __init__(self, home_coords):
        self.home_coords = home_coords
        self.options = self.get_options()
        self.environment = Environment(loader=FileSystemLoader(local_path + '/html'))

    def get_options(self):
        return {'width': 670,
                'height': 470,
                'zoom': 13,
                'format': 'png',
                'access_token': 'pk.eyJ1Ijoia2V2aW4zZHIiLCJhIjoiY2lrOGoxN2s2MDJzYnR6a3drbTYwdGxmMiJ9.bv5u7QgmcJd6dZfLDGoykw',
                'mapid': 'kevin3dr.n56ffjoo',
                'home_coords': self.home_coords,
                'menu': [{'name': 'Home', 'location': '/'},
                         {'name': 'Track', 'location': '/track'},
                         {'name': 'Command', 'location': '/command'}],
                'current_url': '/',
                'json': ''
                }

    def index(self):
        self.options = self.get_options()
        self.options['current_url'] = '/'
        return self.get_template('index')

    def track(self, current_coords):
        self.options = self.get_options()
        self.options['current_url'] = '/track'
        self.options['current_coords'] = current_coords
        self.options['json'] = simplejson.dumps(self.options)
        return self.get_template('track')

    def command(self, current_coords):
        self.options = self.get_options()
        self.options['current_url'] = '/command'
        self.options['current_coords'] = current_coords
        return self.get_template('command')
    
    def get_template(self, file_name):
        template = self.environment.get_template(file_name + '.html')
        return template.render(options=self.options)

"""
Functions to make it easy to convert between the different frames-of-reference. In particular these
make it easy to navigate in terms of "metres from the current position" when using commands that take 
absolute positions in decimal degrees.

The methods are approximations only, and may be less accurate over longer distances, and when close 
to the Earth's poles.

Specifically, it provides:
* get_location_metres - Get LocationGlobal (decimal degrees) at distance (m) North & East of a given LocationGlobal.
* get_distance_metres - Get the distance between two LocationGlobal objects in metres
* get_bearing - Get the bearing in degrees to a LocationGlobal
"""

def get_location_metres(original_location, dNorth, dEast):
    """
    Returns a LocationGlobal object containing the latitude/longitude `dNorth` and `dEast` metres from the 
    specified `original_location`. The returned LocationGlobal has the same `alt` value
    as `original_location`.

    The function is useful when you want to move the vehicle around specifying locations relative to 
    the current vehicle position.

    The algorithm is relatively accurate over small distances (10m within 1km) except close to the poles.

    For more information see:
    http://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
    """

    # if(altitude==0):
    #     altitude=original_location.alt
    earth_radius = 6378137.0 #Radius of "spherical" earth
    #Coordinate offsets in radians
    dLat = dNorth/earth_radius
    dLon = dEast/(earth_radius*math.cos(math.pi*original_location.lat/180))

    #New position in decimal degrees
    newlat = original_location.lat + (dLat * 180/math.pi)
    newlon = original_location.lon + (dLon * 180/math.pi)
    if type(original_location) is LocationGlobal:
        targetlocation=LocationGlobal(newlat, newlon, original_location.alt)
    elif type(original_location) is LocationGlobalRelative:
        targetlocation=LocationGlobalRelative(newlat, newlon, original_location.alt)
    else:
        raise Exception("Invalid Location object passed")
        
    return targetlocation;


def get_distance_metres(aLocation1, aLocation2):
    """
    Returns the ground distance in metres between two LocationGlobal objects.

    This method is an approximation, and will not be accurate over large distances and close to the 
    earth's poles. It comes from the ArduPilot test code: 
    https://github.com/diydrones/ardupilot/blob/master/Tools/autotest/common.py
    """
    # print("This is latitude 2 ",aLocation2.lat)
    # print("This is latitude 1 ",aLocation1.lat)
    dlat = aLocation2.lat - aLocation1.lat
    dlong = aLocation2.lon - aLocation1.lon
    return math.sqrt((dlat*dlat) + (dlong*dlong)) * 1.113195e5


def get_bearing(aLocation1, aLocation2):
    """
    Returns the bearing between the two LocationGlobal objects passed as parameters.

    This method is an approximation, and may not be accurate over large distances and close to the 
    earth's poles. It comes from the ArduPilot test code: 
    https://github.com/diydrones/ardupilot/blob/master/Tools/autotest/common.py
    """	
    off_x = aLocation2.lon - aLocation1.lon
    off_y = aLocation2.lat - aLocation1.lat
    bearing = 90.00 + math.atan2(-off_y, off_x) * 57.2957795
    if bearing < 0:
        bearing += 360.00
    return bearing;

class DroneDelivery():
    def __init__(self,drone):
        self.drone = drone
        self.vehicle = vehicle
        self.templates = Templates(vehicle.location.global_frame)
    
    @cherrypy.expose
    def index(self):
        return self.templates.index()

    @cherrypy.expose
    def command(self):
        return self.templates.command(self.drone.get_location())

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def vehicle(self):
        return dict(position=self.drone.get_location())
    
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def launch(self):
        if not vehicle.armed:
            Drone().launch()
        return dict(position="The Drone has Taken off!!")
    
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def goto(self,north=0, east=0):
        vehicle.groundspeed=2
        print(abs(float(north)))
        print(abs(float(east)))
        if abs(float(north)) == 0.00:
            distance = abs(float(east)) 
        else: 
            distance = abs(float(north)) 
        if (goto(int(north), int(east),self.drone.home_coords))==False:
            return dict(position=-1)
        return dict(position=distance)
    
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def rtl(self):
        if vehicle.armed:
            vehicle.mode = VehicleMode("RTL")
        self.drone.is_flying=False
        return dict(position="The Drone has reached back to Home Location")

    @cherrypy.expose
    def track(self, lat=None, lon=None):
        # Process POST request from Command
        # Sending MAVLink packet with goto instructions
        if(lat is not None and lon is not None):
            self.drone.goto([lat, lon], True)

        return self.templates.track(self.drone.get_location())
    
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def status(self):
        return dict(position=self.drone.distance_from_home())
    
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def has_takenoff(self):
        return dict(position=(self.vehicle.mode.name=="GUIDED"))
    
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def altitude(self,altitude=0):
        print("Reached Altitude function")
        self.drone.change_altitude(altitude)
        print("Changed the altitude")
        print(self.drone.altitude)
        return dict(position=self.drone.altitude)

# Connect to the Vehicle
print('Connecting to vehicle on: %s' % connection_string)
vehicle = connect(connection_string, wait_ready=False,baud=57600)

def goto(dNorth, dEast,home_coords,gotoFunction=vehicle.simple_goto):
    """
    Moves the vehicle to a position dNorth metres North and dEast metres East of the current position.

    The method takes a function pointer argument with a single `dronekit.lib.LocationGlobal` parameter for 
    the target position. This allows it to be called with different position-setting commands. 
    By default it uses the standard method: dronekit.lib.Vehicle.simple_goto().

    The method reports the distance to target every two seconds.
    """
    print("Reached goto function")
    currentLocation = vehicle.location.global_relative_frame
    targetLocation = get_location_metres(currentLocation, dNorth, dEast)
    targetDistance = get_distance_metres(currentLocation, targetLocation)
    print("Current location: ",currentLocation)
    print("Target location: ",targetLocation)

    # Check if the target distance is within the 20m radius circle from the home location
    homeLocation = LocationGlobal(home_coords[0],home_coords[1],home_coords[2])
    distanceFromHome = get_distance_metres(homeLocation, targetLocation)
    print("distance to travel: ",distanceFromHome)
    if distanceFromHome > 20:
        print("Target location is outside the geofence radius of 20m from home location.")
        return False # Exit the function without moving the drone

    gotoFunction(targetLocation)
    
    #print "DEBUG: targetLocation: %s" % targetLocation
    #print "DEBUG: targetLocation: %s" % targetDistance
    
    while vehicle.mode.name=="GUIDED": #Stop action if we are no longer in guided mode.
        #print "DEBUG: mode: %s" % vehicle.mode.name
        remainingDistance=get_distance_metres(vehicle.location.global_relative_frame, targetLocation)
        print("Distance to target: ", remainingDistance)
        if remainingDistance<=targetDistance*0.1: #Just below target, in case of undershoot.
            print("Reached target")
            break;
        time.sleep(2)

# Start web server if enabled
cherrypy.tree.mount(DroneDelivery(Drone()), '/', config=cherrypy_conf)
cherrypy.config.update({'server.socket_port': 8080,
                                'server.socket_host': '0.0.0.0',
                                'log.screen': None})

print('''Server is bound on all addresses, port 8080 You may connect  
        to it using your web broser using a URL looking like this:
        http://localhost:8080/
        ''')
cherrypy.engine.start()
print('Waiting for cherrypy engine...')
cherrypy.engine.block()     
print('waiting to start')

if not args.connect:
    # Shut down simulator if it was started.
    sitl.stop()
