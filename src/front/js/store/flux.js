import Swal from 'sweetalert2'

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			userInfo: "",
			loggedIn: false,
			token: null,
			activity: [
				{
					activity: 'created task',
					date: '1/1/24'
				},
				{
					activity: 'created note',
					date: '1/10/24'
				},
				{
					activity: 'created pago',
					date: '1/12/24'
				},
			],
			tasks: [
				{
					client: 'Daniel test',
					idTask: 1234567,
					title: 'Test task 1',
					description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste nihil tenetur suscipit expedita voluptatibus impedit!',
					dueDate: "2/10/2024",
					priority: 'Medium',
					userAsing: 'Daniel User',
					complete: false

				},
				{
					client: 'Daniel test',
					idTask: 1234578,
					title: 'Test task 2',
					description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste nihil tenetur suscipit expedita voluptatibus impedit!',
					dueDate: "2/10/2024",
					priority: 'Low',
					userAsing: 'Fabian User',
					complete: false

				},
				{
					client: 'Daniel test',
					idTask: 1234590,
					title: 'Test task 3',
					description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste nihil tenetur suscipit expedita voluptatibus impedit!',
					dueDate: "2/10/2024",
					priority: 'High',
					userAsing: 'Ricardo User',
					complete: false

				},
				{
					client: 'Daniel test',
					idTask: 1234521,
					title: 'Test task 4',
					description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste nihil tenetur suscipit expedita voluptatibus impedit!',
					dueDate: "2/10/2024",
					priority: 'Medium',
					userAsing: 'Daniel Abarca User',
					complete: false

				},

			],
			notes: [],
			clients: []
		},
		actions: {
			postLogin: async (user, password) => {
				let data = {
					user_name: user,
					password: password
				};
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/login', {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(data)
					});
					const json = await response.json();

					if (!response.ok) {
						console.log(response.statusText);
						return Swal.fire({
							icon: "error",
							title: "Error",
							text: "Wrong user or password",
						});
					}

					getActions().tokenLogin(json.access_token);
					setStore({ token: json.access_token });

				} catch (error) {
					console.log(error);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: "Failed to log in. Please try again later."
					});
				}
			},
			postSignUp: async (user, email, password) => {
				let newUser = {
					email: email,
					user_name: user,
					password: password
				};
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/signup', {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(newUser)
					});
					const json = await response.json();

					if (!response.ok) {
						console.log(response.statusText);
						return Swal.fire({
							icon: "error",
							title: "Error",
							text: "User name or email already registered, please try again",
						});
					}

					Swal.fire({
						icon: "success",
						title: "Success",
						text: "User created, please log in",
					});

				} catch (error) {
					console.log(error);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: "Failed to create user. Please try again later."
					});
				}
			},
			tokenLogin: (token) => {
				setStore({ loggedIn: true });
				localStorage.setItem("token", token);
			},
			tokenLogout: () => {
				setStore({ loggedIn: false });
				localStorage.removeItem("token");
				setStore({ token: null });
			},
			isLogged: () => {
				if (localStorage.getItem("token")) {
					setStore({ loggedIn: true })
				}
				else {
					setStore({ loggedIn: false })
				}
			},
			getInfo: async () => {
				try {
					const store = getStore();
					const token = store.token || localStorage.getItem("token");

					if (!token) {
						Swal.fire({
							icon: "error",
							title: "Error",
							text: "Session expired, please log in again",
							didClose: () => {
								window.location.href = "/";
							}
						});
						throw new Error("Token is missing");
					}

					const response = await fetch(process.env.BACKEND_URL + '/api/protected', {
						headers: {
							"Authorization": "Bearer " + token
						}
					});

					if (!response.ok) {
						throw new Error("Failed to fetch user info");
					}

					const json = await response.json();
					setStore({ userInfo: json });

				} catch (error) {
					console.error("Error fetching user info:", error.message);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: "Failed to obtain user information. Please try again later."
					});
				}
			},
			changePassword: async (currentPassword, newPassword, confirmPassword) => {
				let passwordInfo = {
					current_password: currentPassword,
					new_password: newPassword,
					confirm_password: confirmPassword
				};
				try {
					const store = getStore();
					const token = store.token || localStorage.getItem("token");

					if (!token) {
						Swal.fire({
							icon: "error",
							title: "Error",
							text: "Session expired, please log in again",
							didClose: () => {
								window.location.href = "/";
							}
						});
						throw new Error("Token is missing");
					}
					const response = await fetch(process.env.BACKEND_URL + '/api/change_password', {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify(passwordInfo)
					});
					const data = await response.json();

					if (!response.ok) {
						if (response.status === 401) {
							throw new Error("Incorrect current password");
						} else if (response.status === 400) {
							throw new Error("New password and confirm password do not match");
						} else {
							throw new Error("Failed to change password. Please try again later.");
						}
					}

					Swal.fire({
						icon: "success",
						title: "Success",
						text: "Password changed, please log in again",
					});

				} catch (error) {
					console.log("Error changing password:", error);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: (error.message + ", please log in and try again"),
					});
				}
			},
			taskAsDone: (id) => {
				const store = getStore()
				const storedTasks = store.tasks
				const correctTask = storedTasks.findIndex(task => task.idTask === id)
				storedTasks[correctTask].complete == false ? storedTasks[correctTask].complete = true : storedTasks[correctTask].complete = false
				setStore({ tasks: storedTasks })


			},
			addClient: async (inputFullName, inputEmail, inputPhone, inputAddress, inputCompany) => {
				const newClient = {
					full_name: inputFullName,
					email: inputEmail,
					phone: inputPhone,
					address: inputAddress,
					company: inputCompany
				};
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/add_client', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(newClient)
					});
					const json = await response.json();

					if (!response.ok) {
						throw new Error('Failed to add client');
					}

					getActions().getClients();

				} catch (error) {
					console.error('Error adding client:', error);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: "Failed to add client. Please try again later."
					});
				}
			},
			getClients: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/clients');
					const data = await response.json();
					setStore({ clients: data })

				} catch (error) {
					console.error('Error fetching clients:', error);
				}
			},
			addNote: async (noteContent, clientId) => {
				try {
					const store = getStore();
					const token = store.token || localStorage.getItem("token");

					if (!token) {
						Swal.fire({
							icon: "error",
							title: "Error",
							text: "Session expired, please log in again",
							didClose: () => {
								window.location.href = "/";
							}
						});
						throw new Error("Token is missing");
					}

					const response = await fetch(process.env.BACKEND_URL + '/api/add_note', {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify({ note_content: noteContent, client_id: clientId })
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error('Failed to add note');
					}

					setStore(prevStore => ({
						...prevStore,
						notes: [...prevStore.notes, data]
					}));
					getActions().getNotes();

				} catch (error) {
					console.error("Error creating note:", error);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: "Failed to create note. Please try again later."
					});
				}
			},
			getNotes: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/notes');
					const data = await response.json();

					setStore({ notes: data })

				} catch (error) {
					console.error('Error fetching clients:', error);
				}
			},
			editNote: async (noteId, newContent) => {
				try {
					const store = getStore();
					const token = store.token || localStorage.getItem("token");

					if (!token) {
						Swal.fire({
							icon: "error",
							title: "Error",
							text: "Session expired, please log in again",
							didClose: () => {
								window.location.href = "/";
							}
						});
						throw new Error("Token is missing");
					}

					const response = await fetch(process.env.BACKEND_URL + `/api/edit_note/${noteId}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify({ note_content: newContent })
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error('Failed to edit note');
					}

					setStore(prevStore => ({
						...prevStore,
						notes: prevStore.notes.map(note => note.id === noteId ? data : note)
					}));
					getActions().getNotes();

				} catch (error) {
					console.error("Error editing note:", error);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: "Failed to edit note. Please try again later."
					});
				}
			},
			deleteNote: async (noteId) => {
				try {
					const store = getStore();
					const token = store.token || localStorage.getItem("token");

					if (!token) {
						Swal.fire({
							icon: "error",
							title: "Error",
							text: "Session expired, please log in again",
							didClose: () => {
								window.location.href = "/";
							}
						});
						throw new Error("Token is missing");
					}

					const response = await fetch(process.env.BACKEND_URL + `/api/delete_note/${noteId}`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						}
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error("Failed to delete note");
					}

					setStore(prevStore => ({
						...prevStore,
						notes: prevStore.notes.filter(note => note.id !== noteId)
					}));
					getActions().getNotes();

				} catch (error) {
					console.error("Error deleting note:", error);

					Swal.fire({
						icon: "error",
						title: "Error",
						text: "Failed to delete note. Please try again later."
					});
				}
			},

			getAllTasksForTotal: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/totaltasks', {
						headers: 
						{
							"Content-Type": "application/json"
						}
					});
			
					if (!response.ok) {
						throw new Error(`Error fetching all tasks for total: ${response.statusText}`);
					}
			
					const data = await response.json();
					setStore({ tasks: data });
				} catch (error) {
					console.error('Error fetching all tasks for total:', error);
				}
			}
		}
	};
};
43
export default getState;
