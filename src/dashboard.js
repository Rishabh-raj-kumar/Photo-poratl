import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "./firebase.config";
import { Link,useNavigate } from "react-router-dom";
function Dashboard() {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const usersCollection = collection(db, "photos");
  const fetchPhotos = async () => {
    const snapshot = await getDocs(usersCollection);
    const photosData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setPhotos(photosData);
  };
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    //   setIsLoading(false);
    });
  }, []);

  function navigatePhoto(id){
    // console.log(id)
    const incrementViewCount = async (photoId) => {
      // Update view count in Firestore
      console.log(photoId)
      const userRef = doc(db, "photos", photoId);
      await updateDoc(userRef, {
        views: increment(1),
      }).then(() =>{
        navigate(`/photo/${id}`);
      });
    };
    incrementViewCount(id)
  }

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <>
      <div className=" g w-full min-h-screen">
        <div>
            <button className=" m-3 text-white rounded px-8 py-3 bg-blue-600">
                <Link to={"/"}>Upload</Link>
            </button>
        </div>
        {photos.length > 0 && (
          <ul className=" grid grid-cols-1 lg:grid-cols-3 gap-4 p-3" >
            {photos.map((photo) => (
              <li key={photo.id} className=" cursor-pointer h-64 p-4 border-2 shadow-lg rounded" onClick={() => navigatePhoto(`${photo.id}`)}>
                <div className=" overflow-hidden relative">
                <img src={photo.url} alt={photo.name} className=" w-full object-cover h-44" />
                </div>
                <p>Views: {photo.views}</p>
                {user.uid === photo.owner && <p>You are the owner.</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Dashboard;
