import React, { useState, useEffect } from "react";
import { app } from "./firebase.config"; // Your Firebase configuration
import {
  getFirestore,
  FieldValue,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import Login from "./Login";
import { Link } from "react-router-dom";

function Mains() {
  const db = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  // const storageRef = ref(storage, 'images/my_image.jpg');

  const usersCollection = collection(db, "photos");

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [photoLink, setPhotoLink] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });
  }, []);

  const handleUpload = (event) => {
    try {
      const imageFile = event.target.files[0];
      const metadata = {
        contentType: "image/jpeg",
      };
  
      const storageRef = ref(storage, "images/" + imageFile.name);
      const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
  
            // ...
  
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setPhotoLink(downloadURL);
            addDoc(usersCollection, {
              owner: user.uid,
              url: downloadURL,
              createdAt: new Date().getTime(), // Use server timestamp for accuracy
              views: 0, // Initialize views
            })
              .then((docRef) => {
                // setLoading((loading) => !loading);
                alert("data added successfully ....");
              })
              .catch((err) => {
                alert("There is some error...", err);
                console.log(err);
              });
          });
        })
      } catch (error) {
        console.log(error)
      }
    }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(photoLink);
    alert('text copied')
  };


  return (
    <div>
      {/* Authentication UI (implement using chosen method) */}
      {user ? (
        <>
        <div className=" w-full h-screen grid place-items-center">
        <div>
            <button className=" m-3 text-white rounded px-8 py-3 bg-blue-600">
                <Link to={"/dashboard"}>Dashboard</Link>
            </button>
        </div>
          <div class="flex items-center justify-center w-[300px]">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input id="dropzone-file" type="file" class="hidden" accept="image/*" onChange={handleUpload} />
            </label>
          </div>

          <div>
            {photoLink && (
              <div className=" m-2">
                <p>Photo Link:</p>
                <a href={photoLink} target="_blank" className=" text-blue-700 underline" rel="noopener noreferrer"
                >
                  {photoLink}
                </a>
                <button onClick={handleCopyLink} className=" px-8 py-3 bg-black text-white rounded m-2 block">Copy Link</button>
              </div>
            )}
          </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default Mains;
