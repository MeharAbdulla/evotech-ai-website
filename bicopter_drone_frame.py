import bpy
import math
from mathutils import Vector

FRAME_LENGTH = 140.0
FRAME_WIDTH = 80.0
WING_SPAN = 160.0
WING_ROOT_CHORD = 95.0
WING_TIP_CHORD = 28.0
WING_THICKNESS = 1.2
WINGLET_HEIGHT = 18.0
WINGLET_THICKNESS = 1.2

SPINE_DIAMETER = 3.2
SPINE_LENGTH = 118.0

ARM_THICKNESS = 3.0
ARM_WIDTH = 8.0
CROSSBAR_LENGTH = 80.0
CROSSBAR_SECTION = (6.0, 3.0)

MOTOR_DIAMETER = 7.0
MOTOR_LENGTH = 20.0
MOTOR_CLAMP_ID = 7.1
MOTOR_CLAMP_OD = 10.8
MOTOR_CLAMP_HEIGHT = 11.0
MOTOR_SPACING = 64.0
MOTOR_Y = -52.0

NOSE_LENGTH = 48.0
NOSE_WIDTH = 36.0
NOSE_HEIGHT = 12.0
NOSE_WALL = 1.2

BATTERY_L = 60.0
BATTERY_W = 18.0
BATTERY_H = 9.0
BATTERY_CLEARANCE = 0.5

ESP32_L = 22.5
ESP32_W = 18.0
ESP32_H = 5.0

MX1508_L = 25.0
MX1508_W = 21.0
MX1508_H = 8.0
MX_HOLE_X = 18.0
MX_HOLE_Y = 15.0
SCREW_D = 2.2

MPU_L = 20.0
MPU_W = 15.0
MPU_FLEX_H = 3.8
MPU_FLEX_T = 0.85

PUSHROD_D = 1.2
PUSHROD_LEN = 95.0
PUSHROD_SPACING = 22.0

CUTOUT_D = 4.8
CUTOUT_SP = 9.0
BEVEL_W = 0.28
BEVEL_SEG = 2


def clear_scene():
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for col in list(bpy.data.collections):
        if col.name not in {"Collection", "Scene Collection"}:
            bpy.data.collections.remove(col)
    for block in (bpy.data.meshes, bpy.data.materials):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def ensure_drone_collection():
    name = "Drone"
    if name in bpy.data.collections:
        col = bpy.data.collections[name]
        for obj in list(col.objects):
            col.objects.unlink(obj)
        return col
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    return col


def link_to_drone(obj, drone_col):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    if obj.name not in drone_col.objects:
        drone_col.objects.link(obj)


def set_active(obj):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)


def deselect_all():
    bpy.ops.object.select_all(action="DESELECT")


def delete_object(obj):
    deselect_all()
    obj.select_set(True)
    bpy.ops.object.delete()


def apply_modifier(obj, mod_name):
    deselect_all()
    set_active(obj)
    bpy.ops.object.modifier_apply(modifier=mod_name)


def apply_bevel(obj, width=BEVEL_W, segments=BEVEL_SEG):
    deselect_all()
    set_active(obj)
    mod = obj.modifiers.new(name="Bevel", type="BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(30)
    apply_modifier(obj, mod.name)


def boolean_difference(target, cutter, name="BoolCut"):
    deselect_all()
    set_active(target)
    mod = target.modifiers.new(name=name, type="BOOLEAN")
    mod.operation = "DIFFERENCE"
    try:
        mod.solver = "EXACT"
    except Exception:
        mod.solver = "FLOAT"
    mod.object = cutter
    apply_modifier(target, mod.name)
    delete_object(cutter)


def boolean_union(target, other, name="BoolUnion"):
    deselect_all()
    set_active(target)
    mod = target.modifiers.new(name=name, type="BOOLEAN")
    mod.operation = "UNION"
    try:
        mod.solver = "EXACT"
    except Exception:
        mod.solver = "FLOAT"
    mod.object = other
    apply_modifier(target, mod.name)
    delete_object(other)


def join_objects(objects, name):
    objects = [o for o in objects if o is not None]
    if not objects:
        return None
    deselect_all()
    for o in objects:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    if len(objects) > 1:
        bpy.ops.object.join()
    result = bpy.context.view_layer.objects.active
    result.name = name
    if result.data:
        result.data.name = name + "_Mesh"
    return result


def create_box(name, size, location=(0.0, 0.0, 0.0), rotation=(0.0, 0.0, 0.0)):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (float(size[0]), float(size[1]), float(size[2]))
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return obj


def create_cylinder(name, radius, depth, location=(0.0, 0.0, 0.0), vertices=48, rotation=(0.0, 0.0, 0.0)):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius,
        depth=depth,
        vertices=vertices,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def create_cone(name, radius1, radius2, depth, location=(0.0, 0.0, 0.0), vertices=32):
    bpy.ops.mesh.primitive_cone_add(
        radius1=radius1,
        radius2=radius2,
        depth=depth,
        vertices=vertices,
        location=location,
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def create_mesh_from_verts(name, verts, faces):
    mesh = bpy.data.meshes.new(name + "_Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def configure_units():
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 0.001
    scene.unit_settings.length_unit = "MILLIMETERS"


def center_and_ground(obj):
    bpy.context.view_layer.update()
    deselect_all()
    set_active(obj)
    bbox = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
    cx = sum(v.x for v in bbox) / 8.0
    cy = sum(v.y for v in bbox) / 8.0
    min_z = min(v.z for v in bbox)
    obj.location.x -= cx
    obj.location.y -= cy
    obj.location.z -= min_z
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)


def build_spine(drone_col):
    spine = create_cylinder(
        "Spine",
        SPINE_DIAMETER * 0.5,
        SPINE_LENGTH,
        location=(0.0, -4.0, 4.0),
        vertices=24,
        rotation=(math.radians(90.0), 0.0, 0.0),
    )
    apply_bevel(spine, width=0.15, segments=1)
    link_to_drone(spine, drone_col)
    return spine


def build_delta_wing(drone_col):
    half = WING_SPAN * 0.5
    tip_y = -WING_ROOT_CHORD * 0.55
    root_front = WING_ROOT_CHORD * 0.45
    root_back = -WING_ROOT_CHORD * 0.55
    tip_front = tip_y + WING_TIP_CHORD
    z0 = 0.0
    z1 = WING_THICKNESS

    verts = [
        (0.0, root_front, z0),
        (half * 0.22, root_front * 0.75, z0),
        (half, tip_front, z0),
        (half, tip_y, z0),
        (half * 0.35, root_back, z0),
        (0.0, root_back, z0),
        (-half * 0.35, root_back, z0),
        (-half, tip_y, z0),
        (-half, tip_front, z0),
        (-half * 0.22, root_front * 0.75, z0),
        (0.0, root_front, z1),
        (half * 0.22, root_front * 0.75, z1),
        (half, tip_front, z1),
        (half, tip_y, z1),
        (half * 0.35, root_back, z1),
        (0.0, root_back, z1),
        (-half * 0.35, root_back, z1),
        (-half, tip_y, z1),
        (-half, tip_front, z1),
        (-half * 0.22, root_front * 0.75, z1),
    ]
    faces = [
        (0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        (10, 19, 18, 17, 16, 15, 14, 13, 12, 11),
        (0, 10, 11, 1),
        (1, 11, 12, 2),
        (2, 12, 13, 3),
        (3, 13, 14, 4),
        (4, 14, 15, 5),
        (5, 15, 16, 6),
        (6, 16, 17, 7),
        (7, 17, 18, 8),
        (8, 18, 19, 9),
        (9, 19, 10, 0),
    ]
    wing = create_mesh_from_verts("DeltaWing", verts, faces)

    spine_cut = create_box(
        "WingSpineSlot",
        (SPINE_DIAMETER + 0.4, SPINE_LENGTH * 0.7, WING_THICKNESS + 1.0),
        location=(0.0, -6.0, WING_THICKNESS * 0.5),
    )
    boolean_difference(wing, spine_cut, name="WingSpine")

    cut_coords = []
    for ix in range(-3, 4):
        for iy in range(-3, 4):
            x = ix * CUTOUT_SP * 1.15
            y = iy * CUTOUT_SP * 1.1 - 8.0
            if abs(x) < 8.0:
                continue
            if abs(x) > half * 0.78:
                continue
            if y > root_front * 0.55 or y < root_back + 8.0:
                continue
            cut_coords.append((x, y, WING_THICKNESS * 0.5))
    for i, (x, y, z) in enumerate(cut_coords):
        c = create_cylinder(f"WingCut_{i:02d}", CUTOUT_D * 0.5, WING_THICKNESS * 2.4, location=(x, y, z), vertices=20)
        boolean_difference(wing, c, name=f"WingLite{i}")

    apply_bevel(wing, width=0.2, segments=1)
    link_to_drone(wing, drone_col)
    return wing


def build_winglets(drone_col):
    parts = []
    half = WING_SPAN * 0.5
    tip_y = -WING_ROOT_CHORD * 0.55
    for side, sign in (("L", -1.0), ("R", 1.0)):
        winglet = create_box(
            f"Winglet_{side}",
            (WINGLET_THICKNESS, WING_TIP_CHORD + 4.0, WINGLET_HEIGHT),
            location=(sign * half, tip_y + WING_TIP_CHORD * 0.45, WINGLET_HEIGHT * 0.5),
        )
        taper = create_box(
            f"WingletTaper_{side}",
            (WINGLET_THICKNESS + 1.0, WING_TIP_CHORD * 0.55, WINGLET_HEIGHT),
            location=(sign * half, tip_y + WING_TIP_CHORD * 0.95, WINGLET_HEIGHT * 0.85),
            rotation=(math.radians(-28.0), 0.0, 0.0),
        )
        boolean_difference(winglet, taper, name=f"WingletShape{side}")
        apply_bevel(winglet, width=0.2, segments=1)
        link_to_drone(winglet, drone_col)
        parts.append(winglet)

        fin = create_box(
            f"VerticalFin_{side}",
            (WINGLET_THICKNESS, 16.0, 14.0),
            location=(sign * 14.0, MOTOR_Y + 8.0, 7.0),
        )
        apply_bevel(fin, width=0.2, segments=1)
        link_to_drone(fin, drone_col)
        parts.append(fin)
    return parts


def build_nose_pod(drone_col):
    z0 = WING_THICKNESS + 0.2
    nose_y = 28.0

    floor = create_box(
        "NoseFloor",
        (NOSE_WIDTH, NOSE_LENGTH, NOSE_WALL),
        location=(0.0, nose_y, z0 + NOSE_WALL * 0.5),
    )
    tip = create_box(
        "NoseTipBlock",
        (NOSE_WIDTH * 0.55, 14.0, NOSE_HEIGHT),
        location=(0.0, nose_y + NOSE_LENGTH * 0.5 - 4.0, z0 + NOSE_HEIGHT * 0.5),
    )
    body = create_box(
        "NoseBody",
        (NOSE_WIDTH, NOSE_LENGTH * 0.72, NOSE_HEIGHT),
        location=(0.0, nose_y - 4.0, z0 + NOSE_HEIGHT * 0.5),
    )
    pod = join_objects([floor, tip, body], "NosePod")

    cavity = create_box(
        "NoseCavity",
        (NOSE_WIDTH - NOSE_WALL * 2.0, NOSE_LENGTH * 0.78, NOSE_HEIGHT - NOSE_WALL),
        location=(0.0, nose_y - 2.0, z0 + NOSE_WALL + (NOSE_HEIGHT - NOSE_WALL) * 0.5),
    )
    boolean_difference(pod, cavity, name="NoseHollow")

    left_cut = create_box(
        "NoseChamfer_L",
        (18.0, 22.0, NOSE_HEIGHT + 2.0),
        location=(-NOSE_WIDTH * 0.55, nose_y + NOSE_LENGTH * 0.28, z0 + NOSE_HEIGHT * 0.5),
        rotation=(0.0, 0.0, math.radians(32.0)),
    )
    right_cut = create_box(
        "NoseChamfer_R",
        (18.0, 22.0, NOSE_HEIGHT + 2.0),
        location=(NOSE_WIDTH * 0.55, nose_y + NOSE_LENGTH * 0.28, z0 + NOSE_HEIGHT * 0.5),
        rotation=(0.0, 0.0, math.radians(-32.0)),
    )
    boolean_difference(pod, left_cut, name="NoseL")
    boolean_difference(pod, right_cut, name="NoseR")

    tip_ball = create_cylinder(
        "NoseTipWeightSeat",
        2.2,
        2.0,
        location=(0.0, nose_y + NOSE_LENGTH * 0.5 - 1.0, z0 + NOSE_HEIGHT * 0.55),
        vertices=20,
        rotation=(math.radians(90.0), 0.0, 0.0),
    )
    boolean_difference(pod, tip_ball, name="TipSeat")

    usb = create_box(
        "ESP32_USB_Access",
        (8.0, 6.0, 6.0),
        location=(0.0, nose_y + 8.0, z0 + NOSE_HEIGHT * 0.55),
    )
    boolean_difference(pod, usb, name="USB")

    reset = create_box(
        "ESP32_Reset_Access",
        (4.0, 4.0, 6.0),
        location=(-10.0, nose_y - 2.0, z0 + NOSE_HEIGHT * 0.55),
    )
    boolean_difference(pod, reset, name="Reset")

    gpio = create_box(
        "ESP32_GPIO_Access",
        (3.0, 16.0, 6.0),
        location=(NOSE_WIDTH * 0.5 - 1.0, nose_y - 4.0, z0 + NOSE_HEIGHT * 0.55),
    )
    boolean_difference(pod, gpio, name="GPIO")

    for i, ang_y in enumerate((-8.0, 8.0)):
        pivot = create_cylinder(
            f"PushrodPivot_{i}",
            1.3,
            4.0,
            location=(( -1 if i == 0 else 1) * (NOSE_WIDTH * 0.5 - 1.5), nose_y + ang_y, z0 + NOSE_HEIGHT * 0.45),
            vertices=16,
            rotation=(0.0, math.radians(90.0), 0.0),
        )
        boolean_difference(pod, pivot, name=f"Pivot{i}")

    for i, (x, y) in enumerate(((-8.0, nose_y - 6.0), (8.0, nose_y - 6.0), (0.0, nose_y + 6.0))):
        vent = create_cylinder(f"NoseVent_{i}", 1.6, NOSE_WALL * 3.0, location=(x, y, z0 + NOSE_WALL * 0.5), vertices=16)
        boolean_difference(pod, vent, name=f"NoseVent{i}")

    spine_socket = create_cylinder(
        "NoseSpineSocket",
        SPINE_DIAMETER * 0.55,
        18.0,
        location=(0.0, nose_y - NOSE_LENGTH * 0.35, 4.0),
        vertices=20,
        rotation=(math.radians(90.0), 0.0, 0.0),
    )
    boolean_difference(pod, spine_socket, name="NoseSpine")

    apply_bevel(pod, width=0.25, segments=2)
    link_to_drone(pod, drone_col)
    return pod


def build_electronics_in_nose(drone_col):
    z0 = WING_THICKNESS + NOSE_WALL + 0.4
    nose_y = 24.0

    mx_pad = create_box(
        "MX1508_Holder",
        (MX1508_W + 2.0, MX1508_L + 2.0, 1.4),
        location=(0.0, nose_y - 6.0, z0 + 0.7),
    )
    hx = MX_HOLE_X * 0.5
    hy = MX_HOLE_Y * 0.5
    for i, (x, y) in enumerate(((-hx, -hy + nose_y - 6.0), (hx, -hy + nose_y - 6.0), (-hx, hy + nose_y - 6.0), (hx, hy + nose_y - 6.0))):
        st = create_cylinder(f"MX_Standoff_{i}", 1.8, 2.6, location=(x, y, z0 + 1.4 + 1.3), vertices=14)
        boolean_union(mx_pad, st, name=f"MXSt{i}")
        hole = create_cylinder(f"MX_Hole_{i}", SCREW_D * 0.5, 6.0, location=(x, y, z0 + 2.0), vertices=14)
        boolean_difference(mx_pad, hole, name=f"MXH{i}")
    for i, x in enumerate((-5.0, 0.0, 5.0)):
        slot = create_box(f"MX_Cool_{i}", (1.8, MX1508_L * 0.55, 2.0), location=(x, nose_y - 6.0, z0 + 0.7))
        boolean_difference(mx_pad, slot, name=f"MXC{i}")
    route = create_box("MX_WireRoute", (4.0, 5.0, 2.5), location=(0.0, nose_y - 6.0 - MX1508_L * 0.45, z0 + 1.5))
    boolean_difference(mx_pad, route, name="MXWire")
    apply_bevel(mx_pad, width=0.15, segments=1)
    link_to_drone(mx_pad, drone_col)

    esp_z = z0 + 1.4 + 2.6 + 0.8
    esp = create_box(
        "ESP32_Holder",
        (ESP32_W + 3.0, ESP32_L + 3.0, 1.4),
        location=(0.0, nose_y + 4.0, esp_z),
    )
    for i, (x, y) in enumerate(((-7.0, nose_y - 2.0), (7.0, nose_y - 2.0), (-7.0, nose_y + 10.0), (7.0, nose_y + 10.0))):
        post = create_cylinder(f"ESP_Post_{i}", 1.3, 4.0, location=(x, y, esp_z + 0.7 + 2.0), vertices=14)
        boolean_union(esp, post, name=f"ESPPost{i}")
    apply_bevel(esp, width=0.15, segments=1)
    link_to_drone(esp, drone_col)

    mpu_z = z0 + 0.2
    mpu_pad = create_box(
        "MPU6050_Platform",
        (MPU_W + 2.0, MPU_L + 2.0, 1.1),
        location=(0.0, 2.0, mpu_z + MPU_FLEX_H + 0.55),
    )
    flexes = []
    for i, ang in enumerate((45.0, 135.0, 225.0, 315.0)):
        rad = math.radians(ang)
        flexes.append(
            create_box(
                f"MPU_Flex_{i}",
                (MPU_FLEX_T, 2.0, MPU_FLEX_H),
                location=(math.cos(rad) * 6.5, 2.0 + math.sin(rad) * 5.5, mpu_z + MPU_FLEX_H * 0.5),
                rotation=(0.0, 0.0, rad),
            )
        )
    base = create_cylinder("MPU_Base", 8.0, 1.0, location=(0.0, 2.0, mpu_z + 0.5), vertices=24)
    base_cut = create_cylinder("MPU_BaseCut", 6.2, 1.6, location=(0.0, 2.0, mpu_z + 0.5), vertices=24)
    boolean_difference(base, base_cut, name="MPURing")
    mpu = join_objects([mpu_pad, base] + flexes, "MPU6050_Holder")
    sens = create_box("MPU_Wire", (2.8, 7.0, 1.6), location=(MPU_W * 0.45, 2.0, mpu_z + MPU_FLEX_H + 0.55))
    boolean_difference(mpu, sens, name="MPUWire")
    apply_bevel(mpu, width=0.12, segments=1)
    link_to_drone(mpu, drone_col)

    return mx_pad, esp, mpu


def build_battery_tray(drone_col):
    tray_l = BATTERY_L + 2.0
    tray_w = BATTERY_W + 2.0
    floor_t = 1.2
    wall_h = BATTERY_H + 1.2
    z0 = -BATTERY_H - 2.0

    floor = create_box("BatteryFloor", (tray_w, tray_l, floor_t), location=(0.0, -6.0, z0 + floor_t * 0.5))
    walls = [
        create_box("BattWall_F", (tray_w, NOSE_WALL, wall_h), (0.0, -6.0 + tray_l * 0.5 - NOSE_WALL * 0.5, z0 + floor_t + wall_h * 0.5)),
        create_box("BattWall_B", (tray_w, NOSE_WALL, wall_h), (0.0, -6.0 - tray_l * 0.5 + NOSE_WALL * 0.5, z0 + floor_t + wall_h * 0.5)),
        create_box("BattWall_L", (NOSE_WALL, tray_l - NOSE_WALL * 2.0, wall_h), (-tray_w * 0.5 + NOSE_WALL * 0.5, -6.0, z0 + floor_t + wall_h * 0.5)),
        create_box("BattWall_R", (NOSE_WALL, tray_l - NOSE_WALL * 2.0, wall_h), (tray_w * 0.5 - NOSE_WALL * 0.5, -6.0, z0 + floor_t + wall_h * 0.5)),
    ]
    holder = join_objects([floor] + walls, "BatteryHolder")

    cavity = create_box(
        "BattCavity",
        (BATTERY_W + BATTERY_CLEARANCE * 2.0, BATTERY_L + BATTERY_CLEARANCE * 2.0, wall_h + 1.0),
        location=(0.0, -6.0, z0 + floor_t + (wall_h + 1.0) * 0.5),
    )
    boolean_difference(holder, cavity, name="BattCav")

    for i, y in enumerate((-18.0, 6.0)):
        for side, x in (("L", -tray_w * 0.5), ("R", tray_w * 0.5)):
            slot = create_box(f"BattStrap_{side}_{i}", (NOSE_WALL + 1.8, 3.0, 1.5), location=(x, -6.0 + y, z0 + floor_t + wall_h * 0.7))
            boolean_difference(holder, slot, name=f"Strap{side}{i}")

    for i, (x, y) in enumerate(((-5.0, -18.0), (5.0, -18.0), (-5.0, 4.0), (5.0, 4.0), (0.0, -7.0))):
        vent = create_cylinder(f"BattVent_{i}", 1.7, floor_t * 2.5, location=(x, y, z0 + floor_t * 0.5), vertices=14)
        boolean_difference(holder, vent, name=f"BVent{i}")

    for side, x in (("L", -tray_w * 0.5 - 1.2), ("R", tray_w * 0.5 + 1.2)):
        support = create_box(f"BattSupport_{side}", (2.0, tray_l * 0.5, 3.0), location=(x, -6.0, z0 + 1.5))
        boolean_union(holder, support, name=f"BSup{side}")

    hanger = create_box(
        "BattHanger",
        (6.0, 10.0, abs(z0) + 2.0),
        location=(0.0, -6.0, z0 * 0.5 + 1.0),
    )
    hanger_cut = create_box(
        "BattHangerCut",
        (SPINE_DIAMETER + 0.6, 12.0, abs(z0)),
        location=(0.0, -6.0, z0 * 0.5 + 2.0),
    )
    boolean_difference(hanger, hanger_cut, name="HangCut")
    boolean_union(holder, hanger, name="AddHang")

    wire = create_box("BattWireExit", (5.0, 4.0, 4.0), location=(0.0, -6.0 + tray_l * 0.5 - 1.0, z0 + floor_t + 3.0))
    boolean_difference(holder, wire, name="BattWire")

    apply_bevel(holder, width=0.2, segments=1)
    link_to_drone(holder, drone_col)
    return holder


def build_motor_crossbar(drone_col):
    bar = create_box(
        "MotorCrossbar",
        (CROSSBAR_LENGTH, CROSSBAR_SECTION[0], CROSSBAR_SECTION[1]),
        location=(0.0, MOTOR_Y, 5.0),
    )
    hub = create_box(
        "CrossbarHub",
        (10.0, 10.0, 4.0),
        location=(0.0, MOTOR_Y, 5.0),
    )
    boolean_union(bar, hub, name="Hub")

    socket = create_cylinder(
        "CrossbarSpineSocket",
        SPINE_DIAMETER * 0.55,
        14.0,
        location=(0.0, MOTOR_Y + 4.0, 4.0),
        vertices=20,
        rotation=(math.radians(90.0), 0.0, 0.0),
    )
    boolean_difference(bar, socket, name="BarSpine")

    for i, x in enumerate((-18.0, -9.0, 9.0, 18.0)):
        lite = create_cylinder(f"BarCut_{i}", 2.2, CROSSBAR_SECTION[1] * 2.5, location=(x, MOTOR_Y, 5.0), vertices=16)
        boolean_difference(bar, lite, name=f"BarLite{i}")

    groove = create_box(
        "MotorWireChannel",
        (CROSSBAR_LENGTH * 0.7, 2.0, 1.0),
        location=(0.0, MOTOR_Y, 5.0 + CROSSBAR_SECTION[1] * 0.5 - 0.35),
    )
    boolean_difference(bar, groove, name="BarWire")

    apply_bevel(bar, width=0.2, segments=1)
    link_to_drone(bar, drone_col)
    return bar


def build_motor_clamp(name, x, drone_col):
    od_r = MOTOR_CLAMP_OD * 0.5
    id_r = MOTOR_CLAMP_ID * 0.5
    h = MOTOR_CLAMP_HEIGHT
    y = MOTOR_Y
    z = 3.2

    body = create_cylinder(f"{name}_Body", od_r, h, location=(x, y, z + h * 0.5), vertices=40)
    bore = create_cylinder(f"{name}_Bore", id_r, h + 2.0, location=(x, y, z + h * 0.5), vertices=40)
    boolean_difference(body, bore, name="Bore")

    slit = create_box(f"{name}_Slit", (1.1, od_r * 2.2, h + 1.0), location=(x + od_r * 0.5, y, z + h * 0.5))
    boolean_difference(body, slit, name="Slit")

    for i, ang in enumerate((-40.0, 40.0)):
        rad = math.radians(ang)
        sx = x + math.cos(rad) * (od_r + 0.15)
        sy = y + math.sin(rad) * (od_r + 0.15)
        zip_slot = create_box(
            f"{name}_Zip_{i}",
            (2.2, 1.5, 1.3),
            location=(sx, sy, z + h * 0.58),
            rotation=(0.0, 0.0, rad),
        )
        boolean_difference(body, zip_slot, name=f"Zip{i}")

    for i, z_off in enumerate((h * 0.3, h * 0.65)):
        for j, ang in enumerate((100.0, 220.0, 340.0)):
            rad = math.radians(ang)
            vx = x + math.cos(rad) * ((id_r + od_r) * 0.5)
            vy = y + math.sin(rad) * ((id_r + od_r) * 0.5)
            vent = create_cylinder(
                f"{name}_Vent_{i}_{j}",
                0.85,
                od_r,
                location=(vx, vy, z + z_off),
                vertices=12,
                rotation=(0.0, math.radians(90.0), rad),
            )
            boolean_difference(body, vent, name=f"Vent{i}{j}")

    lip = create_cylinder(f"{name}_Lip", id_r + 0.5, 0.7, location=(x, y, z + 0.3), vertices=32)
    lip_cut = create_cylinder(f"{name}_LipCut", id_r - 0.2, 1.2, location=(x, y, z + 0.3), vertices=32)
    boolean_difference(lip, lip_cut, name="LipCut")
    boolean_union(body, lip, name="Lip")

    flange = create_box(
        f"{name}_Flange",
        (8.0, 7.0, 2.2),
        location=(x - math.copysign(3.0, x), y, 5.0),
    )
    boolean_union(body, flange, name="Flange")

    apply_bevel(body, width=0.18, segments=2)
    body.name = name
    if body.data:
        body.data.name = name + "_Mesh"
    link_to_drone(body, drone_col)
    return body


def build_pushrods(drone_col):
    rods = []
    for side, sign in (("L", -1.0), ("R", 1.0)):
        rod = create_cylinder(
            f"Pushrod_{side}",
            PUSHROD_D * 0.5,
            PUSHROD_LEN,
            location=(sign * PUSHROD_SPACING * 0.5, -2.0, 7.5),
            vertices=12,
            rotation=(math.radians(90.0), 0.0, math.radians(sign * 4.0)),
        )
        link_to_drone(rod, drone_col)
        rods.append(rod)
    return rods


def build_landing_skids(drone_col):
    skids = []
    for side, x in (("L", -28.0), ("R", 28.0)):
        rail = create_box(
            f"LandingSkid_{side}",
            (2.4, 70.0, 2.2),
            location=(x, -8.0, -BATTERY_H - 4.5),
        )
        for j, y in enumerate((-28.0, 12.0)):
            leg = create_box(
                f"LandingLeg_{side}_{j}",
                (2.4, 2.4, BATTERY_H + 5.0),
                location=(x, y, (-BATTERY_H - 4.5 + WING_THICKNESS) * 0.5),
            )
            boolean_union(rail, leg, name=f"Leg{side}{j}")
        apply_bevel(rail, width=0.2, segments=1)
        link_to_drone(rail, drone_col)
        skids.append(rail)
    return skids


def build_reference_ghosts(drone_col):
    mat = bpy.data.materials.new(name="GhostHardware")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (0.25, 0.55, 0.9, 1.0)
        if "Alpha" in bsdf.inputs:
            bsdf.inputs["Alpha"].default_value = 0.35
    if hasattr(mat, "blend_method"):
        try:
            mat.blend_method = "BLEND"
        except Exception:
            pass

    for side, x in (("L", -MOTOR_SPACING * 0.5), ("R", MOTOR_SPACING * 0.5)):
        m = create_cylinder(
            f"REF_Motor_{side}",
            MOTOR_DIAMETER * 0.5,
            MOTOR_LENGTH,
            location=(x, MOTOR_Y, 3.2 + MOTOR_LENGTH * 0.5),
            vertices=20,
        )
        m.data.materials.append(mat)
        m.display_type = "WIRE"
        link_to_drone(m, drone_col)

        prop = create_box(
            f"REF_Prop_{side}",
            (2.0, 45.0, 0.6),
            location=(x, MOTOR_Y, 3.2 + MOTOR_LENGTH + 1.0),
        )
        prop.data.materials.append(mat)
        prop.display_type = "WIRE"
        link_to_drone(prop, drone_col)

    batt = create_box(
        "REF_Battery_1S_850mAh",
        (BATTERY_W, BATTERY_L, BATTERY_H),
        location=(0.0, -6.0, -BATTERY_H * 0.5 - 1.0),
    )
    batt.data.materials.append(mat)
    batt.display_type = "WIRE"
    link_to_drone(batt, drone_col)

    for name, size, loc in (
        ("REF_ESP32_C3_SuperMini", (ESP32_W, ESP32_L, ESP32_H), (0.0, 28.0, WING_THICKNESS + NOSE_WALL + 8.0)),
        ("REF_MX1508", (MX1508_W, MX1508_L, MX1508_H), (0.0, 18.0, WING_THICKNESS + NOSE_WALL + 4.0)),
        ("REF_MPU6050", (MPU_W, MPU_L, 2.0), (0.0, 2.0, WING_THICKNESS + NOSE_WALL + MPU_FLEX_H + 2.0)),
    ):
        g = create_box(name, size, location=loc)
        g.data.materials.append(mat)
        g.display_type = "WIRE"
        link_to_drone(g, drone_col)


def assemble_frame():
    configure_units()
    clear_scene()
    drone_col = ensure_drone_collection()

    wing = build_delta_wing(drone_col)
    winglets = build_winglets(drone_col)
    spine = build_spine(drone_col)
    nose = build_nose_pod(drone_col)
    mx, esp, mpu = build_electronics_in_nose(drone_col)
    battery = build_battery_tray(drone_col)
    crossbar = build_motor_crossbar(drone_col)
    motor_l = build_motor_clamp("MotorClamp_L", -MOTOR_SPACING * 0.5, drone_col)
    motor_r = build_motor_clamp("MotorClamp_R", MOTOR_SPACING * 0.5, drone_col)
    rods = build_pushrods(drone_col)
    skids = build_landing_skids(drone_col)

    structural = [wing] + winglets + [spine, nose, mx, esp, mpu, battery, crossbar, motor_l, motor_r] + rods + skids
    frame = join_objects(structural, "PaperJetBicopterFrame")
    link_to_drone(frame, drone_col)
    center_and_ground(frame)

    build_reference_ghosts(drone_col)

    deselect_all()
    set_active(frame)
    return frame


if __name__ == "__main__":
    assemble_frame()
