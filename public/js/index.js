fetch(`/projectsenior/index`, {})
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    // console.log('Logged in user:', data.loggedIn);
    // console.log('Role:', data.role);
    // console.log('Username:', data.userName);
    localStorage.setItem('loggedIn', data.loggedIn);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userName', data.userName);
    if (!data.loggedIn) {
      document.getElementById('loginButton').style.display = 'block';
      document.getElementById('registerButton').style.display = 'block';
      document.getElementById('menuClassroom').href = 'login';
    } else {
      document.getElementById('logoutButton').style.display = 'block';
      if (data.role == 'Student') {
        localStorage.setItem('studentId', data.loggedIn);
        const menuClassroom = document.getElementById('menuClassroom');
        menuClassroom.href = 'classroom_student';
      } else if (data.role == 'Teacher') {
        const menuClassroom = document.getElementById('menuClassroom');
        menuClassroom.href = 'classroom?name=' + data.userName;
      } else if (data.role == 'Admin') {
        window.location.href = 'manage_teacher';
      }
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });