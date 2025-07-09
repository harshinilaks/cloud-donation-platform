# ReliefDrop 🌟

A community-driven platform where neighbors can share and organize donation efforts for local events — like toy drives, robotics club fundraisers, or neighborhood cleanups.

---

## 🎯 Project Purpose

I built ReliefDrop as a learning project to:

- Understand how to build **serverless architectures** on AWS
- Practice integrating cloud services like DynamoDB and S3
- Learn how to design and deploy REST APIs using API Gateway and Lambda
- Build a full-stack application with a modern frontend and cloud backend
- Gain experience troubleshooting complex integrations

Beyond learning, the vision is to create a platform empowering neighborhoods to **quickly organize donation drives** for any local cause — reducing friction and fostering community engagement.

---

## 💡 Potential Community Impact

Imagine:

- **Community Toy Drive**  
  Residents post the toy drive as a drop zone; neighbors upload donations with attached notes and files (e.g. flyers or inventory lists).

- **Robotics Club Fundraiser**  
  A local school’s robotics team creates a drop zone listing needed items like parts or tools; supporters donate and upload related documents.

- **Playground Cleanup**  
  Neighbors coordinate a cleanup day, listing supplies needed (trash bags, gloves, refreshments), and volunteers upload resources.

ReliefDrop makes it simple for neighbors to **create drop zones, list needed items, and contribute donations seamlessly.**

---

## ⚙️ Technologies Used

### Backend (AWS)

- **AWS Lambda** – Serverless compute running the API logic
- **Amazon API Gateway** – Exposes REST endpoints
- **Amazon DynamoDB** – Stores drop zone metadata and donation records
- **Amazon S3** – Stores uploaded files and provides downloadable links
- **AWS SDK for JavaScript** – Interfaces with DynamoDB and S3

### Frontend

- **Vite** + **React** – Modern, fast frontend
- **JavaScript (ES6+)**
- **Custom CSS** – Styled UI with pastel color palette

---

## 🚀 What I Learned

✅ Deploying AWS Lambda functions (packaging, environment variables, troubleshooting handler errors)  
✅ Configuring API Gateway routes and integrations  
✅ Solving **CORS issues** for frontend-to-backend communication  
✅ Managing binary file uploads to S3 and generating signed download URLs  
✅ Writing reusable, modular backend code  
✅ Frontend forms, controlled components, and file handling in React  
✅ Deploying frontends to Vercel and connecting them to a live API  
✅ Debugging complex end-to-end flows (e.g. API integration issues)

---

## 🛠️ Next Steps

- **Authentication & Authorization**  
  Implement user accounts so only authorized users can manage drop zones.

- **Real-Time Updates**  
  Show donations as they come in without page refresh.

- **Search & Filter**  
  Help users discover drop zones based on category, proximity, or urgency.

- **Better UX for File Uploads**  
  Drag-and-drop, progress bars, and file previews.

- **Mobile Responsiveness**  
  Optimize for all devices.

- **Analytics**  
  Track donation trends and community engagement.

---

## 🎥 Demo Video

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID_HERE" frameborder="0" allowfullscreen></iframe>
