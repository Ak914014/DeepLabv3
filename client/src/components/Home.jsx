import React,{useState} from 'react'
import Header from './Header'
import Form from './Form'
import ImageComponent from './ImageComponent'
import ExecutionComponent from './ExecutionComponent'

const Home = () => {
    const [image, setImage] = useState(null);
  return (
    <div className='p-5 w-full h-screen border-2 border-gary-800 rounded-3xl'>
         <Header/>
         <div className='flex gap-4 flex-row'>
         <div className='w-1/3'> 
            <Form setImage={setImage} />
             <ImageComponent image={image} />
         </div>
         <div className='w-2/3'>
            <ExecutionComponent />
         </div>
         </div>
    </div>
  )
}

export default Home