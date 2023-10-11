import logo from '../assets/logo_white.svg';
import illu_precise from '../assets/illu_precise.svg';
import illu_data_driven from '../assets/illu_data_driven.svg';
import illu_ideation from '../assets/illu_ideation.svg';
import { Button, Link } from '@mui/material';
import TeamMember from './TeamMember';
import { teamMemberInfos } from '../data/teamMemberInfos';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useEffect } from 'react';
import { useThemeContext } from '../theme';

const backendServer = import.meta.env.VITE_BE_SERVER;

const registerUser = async (accessToken: string) => {
  try {
    await axios.post(`${backendServer}api/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.log('Error:', (error as Error).message);
  }
};

interface PointProp {
  imgUrl: string;
  alt: string;
  header: string;
  text: string;
}

const Point: React.FC<PointProp> = ({ imgUrl, alt, header, text }) => {
  return (
    <div className="grid grid-rows-7 p-4 w-full max-w-[400px] h-[300px] m-auto">
      <img
        src={imgUrl}
        alt={alt}
        className="rounded w-[240px] h-[240px] my-5 m-auto row-span-3"
      />
      <h3 className="mb-2 uppercase text-center font-bold">{header}</h3>
      <p className="text-base row-span-3">{text}</p>
    </div>
  );
};

const AboutUs = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { darkMode } = useThemeContext();

  const userCheck = async () => {
    const accessToken = await getAccessTokenSilently();
    if (isAuthenticated) {
      registerUser(accessToken);
    }
  };

  useEffect(() => {
    userCheck();
  }, []);

  return (
    <div className="-mt-16 m-auto">
      <div className={`flex flex-col ${darkMode ? 'bg-[#97B2EF]' : 'bg-Blue'}`}>
        <div className="flex pt-16 w-100 justify-center h-[90vh]">
          <div className="max-w-[1500px] flex md:flex-row flex-col justify-center gap-10">
            <img
              src={logo}
              className="md:w-1/4 w-1/3 md:mx-10 mx-0 fill-white"
            />
            <div className="max-w-[500px] w-2/3 flex flex-col justify-center items-center gap-3">
              <h1 className="text-7xl font-bold text-white">MATCHING</h1>
              <h1 className="text-7xl font-bold text-white">TALENTS</h1>
              <p className=" text-white text-center text-sm my-4">
                Presenting TalentHub by Lups Tech! We transform complex
                recruitment data into clear, intuitive visualizations, equipping
                recruiters with the power to make informed, data-driven
                decisions. Experience unparalleled efficiency, conserve valuable
                resources, and pinpoint the ideal candidates tailored to each
                client's unique requirements.
              </p>
              <Button
                sx={{
                  background: '#3A3C4E',
                  '&:hover': { background: '#E7EBFF', color: '#000000' },
                }}
              >
                Match Your Talents
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={`pt-10  pb-96 ${darkMode ? 'bg-[#97B2EF]' : 'bg-Blue'}`}>
        <div className="grid md:grid-cols-3 grid-flow-row gap-3 text-white w-4/5 m-auto">
          <Point
            imgUrl={illu_precise}
            alt="Point 1"
            header="Precise"
            text="Discover unparalleled talent swiftly and proficiently through our elite Recruiters' Hub, where exceptional talents align seamlessly with exacting demands."
          />
          <Point
            imgUrl={illu_data_driven}
            alt="Point 2"
            header="Data-Driven"
            text="Delve deep into intricate recruitment data and unearth invaluable insights with our interactive hub, designed for effortless navigation and comprehension."
          />
          <Point
            imgUrl={illu_ideation}
            alt="Point 3"
            header="Innovative"
            text="Experience cutting-edge talent acquisition with our innovative Recruiters' Hub, revolutionizing and refining the talent discovery journey."
          />
        </div>
      </div>

      <div className="pt-20">
        <div className="grid grid-cols-3 items-center w-2/3 m-auto">
          <div className="uppercase flex justify-center align-center">
            <h3 className="text-3xl font-bold">tech stack</h3>
          </div>
          <div className="col-span-2">
            <p>
              This frontend is built in{' '}
              <Link href="https://vitejs.dev/">Vite</Link>/React using
              TypeScript. Styled by <Link href="https://mui.com/">MUI</Link> and{' '}
              <Link href="https://tailwindcss.co/">TailwindCSS</Link>.{' '}
              <Link href="https://zod.dev/">Zod</Link> is used for form
              validation and forms are handled using{' '}
              <Link href="https://www.react-hook-form.com/">
                React-Hook-Form
              </Link>
              . We use <Link href="https://auth0.com/">Auth0</Link> for
              authorization and authentication via JWTs. The backend is in
              C#/.Net Core and is connected to a project hosted on Supabase. The
              project is therefore based on a PostgreSQL database. Jobs data is
              from{' '}
              <Link href="https://jobtechdev.se/sv">JobTech Development</Link>{' '}
              Illustrations for this page are from{' '}
              <Link href="https://undraw.co/">undraw</Link>.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="grid grid-cols-3 items-center w-2/3 m-auto">
          <div className="uppercase flex justify-center align-center">
            <h3 className="text-3xl font-bold">team</h3>
          </div>
          <div className="col-span-2">
            <p>
              Our project boasts an exceptional team of seven full-stack
              developers, each of whom is a graduate of SALT and actively
              engaged in a postgraduate program. Their diverse skill sets, honed
              through intensive training, contribute to our project's success,
              bringing innovation and expertise to every aspect of development.
              Together, they form a dynamic and passionate team dedicated to
              delivering exceptional results.
            </p>
          </div>
        </div>
        <div className="max-w-[1000px] grid md:grid-cols-3 gap-14 justify-items-center m-auto my-20">
          {teamMemberInfos.map(info => (
            <TeamMember memberInfo={info} key={Math.random()} />
          ))}
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto flex flex-col items-center py-5">
        <p className="mx-auto text-sm">
          © 2023 Lups Tech, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
