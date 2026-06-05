extends CharacterBody3D

@onready var pivot := $Node3D
@onready var camera := $Node3D/Camera3D
@onready var mesh := $MeshInstance3D

const SPEED = 5.0
const MOUSE = 0.01

var yaw := 0.0
var pitch := 0.0

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	elif event.is_action_pressed("ui_cancel"):
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)

	if Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		if event is InputEventMouseMotion:
			#rotate_y(-event.relative.x * 0.01)
			#rotate_z(-event.relative.y * 0.01)
			yaw -= event.relative.x * MOUSE
			pitch = clamp(pitch + event.relative.y * MOUSE, deg_to_rad(-89), deg_to_rad(89))
			
			# Apply yaw to body
			rotation.y = yaw
			
			# Apply pitch to camera
			pivot.rotation.x = pitch
			
			# Apply both yaw and pitch to mesh
			var mesh_basis := Basis(Vector3(1, 0, 0), pitch) * Basis(Vector3(0, 1, 0), yaw)
			mesh.rotation = mesh_basis.get_euler()

func _physics_process(delta: float) -> void:
	
	# Handle up/down
	if Input.is_action_pressed("eye_up"):
		velocity.y = SPEED
	elif Input.is_action_pressed("eye_down"):
		velocity.y = -1 * SPEED
	else:
		velocity.y = move_toward(velocity.y, 0, SPEED)

	# Handle WASD
	var input_dir := Input.get_vector("eye_strafeleft", "eye_straferight", "eye_forward", "eye_backward")
	var direction = (camera.transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	if direction:
		velocity.x = direction.x * SPEED
		velocity.z = direction.z * SPEED
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		velocity.z = move_toward(velocity.z, 0, SPEED)

	move_and_slide()
