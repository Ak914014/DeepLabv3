# DeepLab V3

Semantic segmentation is the problem of detecting and delineating each object of interest appearing in an image. Currently, there are several approaches that solve this problem and produce results as seen below.

This project uses TensorFlow.js to perform segmentation on uploaded image using any one of the 3 models (pascal / cityscapes / ade20k)

![Screenshot (546)](https://github.com/user-attachments/assets/d714a967-48a4-49f0-9dc2-54b3bb81c524)


## Getting Started

### Front-end 

To run the front-end use these following steps :

```
cd client 
npm install 
npm run dev 
```
now use http://localhost:5173 to view your front-end app

### Back-end 

To run the Back-end use these following steps :

```
cd server
```
Make sure you already have docker installed in your system

now first build the container
```
docker build -t deeplab .
```

after this run the docker image 

```
docker run -p 3100:3100 deeplab
```

to see the documantaion go to this port
http://localhost:3100/api-docs/


