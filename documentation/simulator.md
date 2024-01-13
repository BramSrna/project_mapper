To make the front-end more friendly, the project planner shall support a simulator in addition to and alongside the visualizer. To facilitate this, a simulator package will be build in Python. The simulator can be used to define the appearance of a component and the behaviour of the component when run through the simulator.

For example, for a farm component something similar to the farm_component code sample could be used.


class FarmComponent(SimulatorObject):
    def __init__(self, location):
        self.location = location
        self.registered_users = []

    def add_registered_user(self, new_user):
        self.registered_users.append(new_user)

    def get_apperance(self):
        return Simulator.square(length: 1, width: 1)

    def get_action(self, simulator_step):
        grown_crops = []
        for (user in self.registered_users):
            grown_crops.append(user.get_desired_crops())