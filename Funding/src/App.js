// import React from 'react'
// import ReactDOM from "react-dom";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./screens/Home";
// import Signin from "./screens/Signin";
// // import Signup from "./screens/Signup";
// // import Home from "./screens/Home";
// // import Home from "./screens/Home";
// export default function App() {
//   return (
//     <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Home />}>
//         {/* <Route index element={<Home />} /> */}
//         <Route path={Signin} element={<Signin />} />
//         {/* <Route path="contact" element={<Contact />} /> */}
//         {/* <Route path="*" element={<NoPage />} /> */}
//       </Route>
//     </Routes>
//   </BrowserRouter>
//   );
// }
import React from 'react';
// import './App.css';
// import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route}
	from 'react-router-dom';
import Home from './screens/Home';
import Signin from './screens/Signin';
import Owner from './screens/Owner';
import SignUp from './screens/Signup';
import Contribution from './screens/Contribution';
import Ownerdas from './screens/ownerdas';
import RequestPage from './screens/Requestpage';
function App() {
return (
	<Router>
	{/* <Navbar /> */}
	
	<Routes>
		<Route exact path='/'  element={<Home />} />
		<Route path='/signin' element={<Signin/>} />
		<Route path='/owner' element={<Owner/>} />
		<Route path='/contribution' element={<Contribution/>} />
		<Route path='/signup' element={<SignUp/>} />
		<Route path='/ownerPage' element={<Ownerdas/>}/>
		<Route path='/request' element={<RequestPage/>}/>
	</Routes>
	</Router>
);
}

export default App;
