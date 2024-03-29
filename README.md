# Talent Hub - React Frontend (Vite)

This repository forms part of a mob-programming project. The overall project is a job seeking system that can anaylse job adverts and display matching developers, to allow for easier and more effective recruitment.

The backend for this project can be found [here](https://github.com/lups-tech/talenthubBE).

## The Tech Stack
This frontend is built in Vite/React using TypeScript. [Zod](https://zod.dev/) is used for form validation and forms are handled using [React-Hook-Form](https://www.react-hook-form.com/). We use [Auth0](https://auth0.com/) for authorization and authentication via JWTs.

As outlined in the backend repository, the backend is in C#/.Net Core and is connected to a project hosted on Supabase. The project is therefore based on a PostgreSQL database.

## Start-Up

### Auth0
As noted above, Auth0 is used for authorization and a corresponding Auth0 M2M application is needed. The M2M frontend application should be configured to allow login and logout from and to the frontend urls and authorized to access the backend API and relevant permissions.

### Variables
The following environment variables should be added in a .env file in the root of the project:

- VITE_BE_SERVER = the address of the backend server being called (usually a localhost port in development)
- VITE_REACT_APP_AUTH0_DOMAIN = the domain assigned to the Auth0 account that created the applications (starting with ```https://``` and ending ```.com```)
- VITE_REACT_APP_AUTH0_CLIENT_ID = The client id assigned to the M2M application set up in Auth0
- VITE_REACT_APP_AUTH0_CALLBACK_URL = The callback URL you assign for Auth0, ie. the url that the user is returned to after logging in. This should be matched in the allowed callback url address in the Auth0 dashboard for this user.
- VITE_REACT_APP_AUTH0_AUDIENCE = the audience assigned to the Auth0 API for the backend project. Usually as a url address, but not required.

### Final Steps
Once the above set up has been done, the project can be ran in development mode with:

```npm run dev```

## Page Structure
We have now implemented user authorization and authentication. As a result, the structure of the site may alter slightly in the future to allow for personalisation. The hope is to allow for multi-tenancy with different organisations, who would save their own jobs and have their own lists of developers.

At present there are two main parts of the site. The Developer creation (where skills are added to the developer) and the Job Search (that filters through jobs from the [JobTech API](https://jobtechdev.se/sv) and produces a list of relevant developers that match the requirements of that job. 

We are working on adding further functionality and improving the UX throughout the site.

## The Team
This project has been built by the following developers:
- [Luca Martinelli](https://github.com/Luega)
- [Feng Yang](https://github.com/Finns841594)
- [Panisara Bunawan Dachin](https://github.com/panisara-bd)
- [Stephen Moore](https://github.com/SMooreSwe)
- [Chris O'Brien](https://www.linkedin.com/in/chris-o-brien-314791212/)
- [Sonja Kitanoska](https://www.linkedin.com/in/sonja-kitanoska-986ba8a8/)

Together we are [Lups-Tech](https://github.com/lups-tech).

## Next Steps
We are approaching this project with an agile approach, consisting of 1 week sprint goals. Once we are happy with the MVP we have plans on refining the product and continuing to add value. Our current goals are to add:

- ~~Complete path upon developer creation.~~(Now added)
- ~~Multi-Tenancy - to allow for multiple companies to use the product, with their own private lists of developers (user authorization and authentication is now in place with third party log-in via google, as well as email and password)~~.(Now added)
- ~~The ability to save jobs to your account, to allow for ease of access to those details during hiring processes, or should a developer become available.~~(Now added)
- Easier editing of existing developers.
