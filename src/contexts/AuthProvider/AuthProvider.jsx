import { createContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(null);

  // const [loading, setLoading] = useState(true);

  // // const user = await

  // // console.log('state user', user);
  // // console.log(user);
  // const providerLogin = (provider) => {
  //   setLoading(true);
  //   return signInWithPopup(auth, provider);
  // };

  // const updateUser = (userInfo) => {
  //   setLoading(true);
  //   console.log(userInfo);
  //   return updateProfile(auth.currentUser, userInfo);
  // };

  // const logOut = () => {
  //   setLoading(true);
  //   return signOut(auth);
  // };

  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //       setUser(currentUser);
  //       // console.log(currentUser);
  //       setLoading(false);
  //     });

  //     return () => {
  //       unsubscribe();
  //     };
  //   }, []);

  const authInfo = {
    // user,
    // loading,
    // providerLogin,
    // updateUser,
    // logOut,
    // setLoading,
    // handleMobileLogin,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
