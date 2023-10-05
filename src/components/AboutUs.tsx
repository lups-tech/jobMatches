import logo from '../assets/logo.svg';
import { Button, Card, CardContent, Typography } from '@mui/material';

interface PointProp {
  imgUrl: string;
  alt: string;
  header: string;
  text: string;
}

const Point: React.FC<PointProp> = ({ imgUrl, alt, header, text }) => {
  return (
    <div className="p-4 w-full max-w-[400px] m-auto">
      <img src={imgUrl} alt={alt} className="rounded my-6 m-auto" />
      <h3 className="mb-2 uppercase text-center">{header}</h3>
      <p>{text}</p>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="-mt-16 m-auto">
      <div className="flex flex-col bg-Blue">
        <div className="flex pt-16 w-100 justify-center h-[90vh]">
          <div className="max-w-[1500px] flex md:flex-row flex-col justify-center gap-10">
            <img src={logo} className="md:w-1/4 w-1/3 md:mx-10 mx-0" />
            <div className="max-w-[500px] w-2/3 flex flex-col justify-center items-center gap-3">
              <h1 className="text-7xl font-bold text-white">MATCHING</h1>
              <h1 className="text-5xl font-bold text-white">TALENTS</h1>
              <p className=" text-white text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                pariatur aspernatur eveniet ad a explicabo laboriosam,
                recusandae ipsam ipsum placeat, neque, eum ab mollitia. Ad illo
                nemo adipisci suscipit earum.
              </p>
              <Button
                sx={{
                  background: '#3A3C4E',
                  '&:hover': { background: '#E7EBFF', color: '#000000' },
                }}
              >
                Click Here!
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 pb-36 bg-Blue">
        <div className="grid md:grid-cols-3 grid-flow-row gap-3 text-white w-4/5 m-auto">
          <Point
            imgUrl="https://picsum.photos/200"
            alt="Point 1"
            header="Point 1"
            text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque corporis mollitia, commodi iste quae, expedita, ipsa totam ab laborum laboriosam perferendis blanditiis quod in impedit. Quidem cum possimus animi eveniet!"
          />
          <Point
            imgUrl="https://picsum.photos/200"
            alt="Point 2"
            header="Point 2"
            text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque corporis mollitia, commodi iste quae, expedita, ipsa totam ab laborum laboriosam perferendis blanditiis quod in impedit. Quidem cum possimus animi eveniet!"
          />
          <Point
            imgUrl="https://picsum.photos/200"
            alt="Point 3"
            header="Point 3"
            text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque corporis mollitia, commodi iste quae, expedita, ipsa totam ab laborum laboriosam perferendis blanditiis quod in impedit. Quidem cum possimus animi eveniet!"
          />
        </div>
      </div>

      <div className="py-20">
        <div className="grid grid-cols-3 items-center w-2/3 m-auto">
          <div className="uppercase flex justify-center align-center">
            <h3 className="text-3xl font-bold">team</h3>
          </div>
          <div className="col-span-2">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
              incidunt sint, voluptatum eaque reiciendis ex numquam ut qui
              voluptates animi! Voluptatibus dolores in at aperiam ad reiciendis
              perspiciatis quos doloremque!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent>
              <Typography>Hello</Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
