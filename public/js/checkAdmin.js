// Check Role Admin
const role = localStorage.getItem('role');
if (role !== 'Admin' || role === null) {
  window.location.href = 'index';
}