# [Haunted-house](https://haunted-house.kyledlong.com)

This haunted-house project was built in the progress of the [Three.js journey](https://threejs-journey.com) course, focusing on gemoetry, materials, lighting, shadows.
<br>

## Tech

|                |               |
| -------------- | ------------- |
| JS             | Three.js      |
| HTML           | CSS           |
| Vite           | Github actions|
| Hostinger      | Webhooks      |



<br>

This project is...

<br>

## How to Use
<br>

1. Clone the repository:

```bash
git clone https://github.com/KD-Long/haunted-house.git
```

2. Install the dependencies:

```bash
cd haunted-house
npm install
```

3. Run the project:

```bash
npm run dev
```

3. Open your web browser and navigate to http://localhost:3000 to access the project.

4. For steps on how to intergrate CI into this project and have updates build to hostinger follow this [guide](https://dev.to/mwoodson11/create-deployment-pipeline-for-react-app-on-hostinger-5bc9).

<br>

## Workflow 

<br>

1. Git push from local --> main branch
```bash
git add --all
git commit -m 'commmit msg'
git push -u origin main
```

2. Github actions trigger build --> build branch (dist folder from $npm run build)

3. Webhook event triggered --> hostinger

4. Automatic deployment --> ~/public_html/_sub_haunted-house/

5. Configured sub domain [haunted-house.kyledlong.com](haunted-house.kyledlong.com) to point to "_sub_haunted-house/" folder