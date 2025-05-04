import React, { useContext, useEffect, useState } from 'react';
import AuthForm from './components/Auth/AuthForm';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import { AuthContext } from './context/AuthProvider';

const App = () => {
  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  
  // Access context properly - destructure the array from context
  const [userData, setUserDataAndSync] = useContext(AuthContext);
  
  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if(loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData.role);
      setLoggedInUserData(userData.data);
    }
  }, []);
  
  const handleLogin = (email, password) => {
    // First check if admin credentials
    if ((email === 'admin@me.com' || email === 'admin@example.com') && password === '123') {
      setUser('admin');
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }));
    }
    
    // Then check if employee credentials
    else if (userData) {
      const employee = userData.find((e) => email === e.email && password === e.password);
      if (employee) {
        setUser('employee');
        setLoggedInUserData(employee);
        localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: employee }));
      } else {
        alert("Invalid Credentials");
      }
    } else {
      alert("Invalid Credentials");
    }
  };
  
  return (
    <>
      {!user ? <AuthForm handleLogin={handleLogin} /> : ''}
      {user === 'admin' ? 
        <AdminDashboard changeUser={setUser} /> :
        (user === 'employee' ?
          <EmployeeDashboard changeUser={setUser} data={loggedInUserData} /> :
          null
        )
      }
    </>
  );
};

export default App;
