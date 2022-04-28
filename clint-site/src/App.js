import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [info, setInfo] = useState({});
  const [file, setFile] = useState(null);

  const handleBlur = (e) => {
    const newInfo = { ...info };
    newInfo[e.target.name] = e.target.value;
    setInfo(newInfo);
  }

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
  }

  const handleFileSubmit = () => {

    const formData = new FormData()
    formData.append('file', file);
    formData.append('name', info.name);
    formData.append('email', info.email);

    console.log(formData);

    fetch('https://image-upload-r.herokuapp.com/addImage', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  // console.log(file);
  return (
    <div className="App">
      <form className='formStyle' onSubmit={handleFileSubmit}>
        <div class="form-group">
          <label for="email">Name</label>
          <input onBlur={handleBlur} type="text" class="form-control" placeholder="Name" name='name' />
        </div>
        <div class="form-group">
          <label for="email">email</label>
          <input onBlur={handleBlur} type="text" class="form-control" placeholder="email" name='email' />
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Image</label>
          <input onChange={handleFileChange} type="file" class="form-control" name='image' placeholder="image" />
          {/* <input onChange={handleChange} type="file" class="form-control" name='image' id="exampleInputName" placeholder="Picture" /> */}
        </div>
        <input type="submit" value="Submit"/>
      </form>

      <ImageGalary/>
    </div>
  );
}


const ImageGalary = () => {
  const [allImages, setAllImages] = useState([]);

  useEffect(()=>{
    fetch('https://image-upload-r.herokuapp.com/allImages')
    .then(res => res.json())
    .then(data => setAllImages(data))
  }, [])

  console.log(allImages);
  return (
    <div className='floatClear'>
      {
        allImages.map(image => <div className='images'>
          <img src={`https://image-upload-r.herokuapp.com/${image.img}`} alt="" height='100' width='100' />
          <p>Name: {image.name}</p>
          <p>Email: {image.email}</p>
        </div>)
      }
    </div>
  );
};


export default App;
