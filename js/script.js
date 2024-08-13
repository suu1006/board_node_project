// function handleLogin() {
//     fetch('/auth/loginPage', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     }).then(res => {
//         if (res.status === 200) {
//             window.location.href = '/auth/loginPage';
//         }
//     }).catch(err => {
//         console.error(err);
//     });
// }



// function handleLogout() {
//     window.location.href = '/auth/logout';
// }

// function updateLoginStatus(loggedIn) {
//     const loginBtn = document.getElementById('loginBtn');
//     const logoutBtn = document.getElementById('logoutBtn');

//     if (loggedIn) {
//         loginBtn.style.display = 'none'; 
//         logoutBtn.style.display = 'block'; 
//     } else {
//         loginBtn.style.display = 'block'; 
//         logoutBtn.style.display = 'none'; 
//     }
// }

// function handleMenuList() {
//     fetch('/menus/getMenuList', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     })
//     .then(res => {
//         if (res.ok) {
//             return res.json();
//         } else {
//             throw new Error('메뉴 리스트 가져오기 실패');
//         }
//     })
//     .then(data => {
//         const postList = document.getElementById('postList').parentElement;
//         while (postList.firstChild) {
//             postList.removeChild(postList.firstChild);
//         }
//     }).catch(err => {
//         console.error(err);
//     });
// }

// function removeTable() {
//     const currentPath = window.location.pathname;
//     if (currentPath === '/auth/menu' || currentPath === '/auth/talk') {
//         const table = document.querySelector('table');
//         if (table) {
//             table.remove();
//         }
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     removeTable();
//     handleMenuList();
// });
