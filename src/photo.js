import {useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import {
  getDoc,
  doc,
  getFirestore
} from "firebase/firestore";
import { app } from "./firebase.config";

function Photo() {
  const db = getFirestore(app);
  const { id } = useParams();
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    async function getData(){
    try {
      const docSnap = await getDoc(doc(db, "photos", id));

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setBlog(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (err) {
      console.log(err);
    }
  }
  getData()
    // console.log(blog)
  }, []);
  return (
    <div className='h-screen grid place-items-center p-3'>
      <img src={blog.url} alt='image'/>
    </div>
  )
}

export default Photo