import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import 'tachyons';

function App() {
  const [ init, setInit ] = useState(false);
  const [ imageUrl, setImageUrl ] = useState('');
  const [ box, setBox ] = useState([]);
  const [ route, setRoute ] = useState('signin')
  const [ isSignedIn, setIsSignedIn ] = useState(false);
  const [ user, setUser ] = useState({
    id: '',
    name: '', 
    email: '',
    entries: 0,
    joined: ''
  })

  // Initiating particles background
  useEffect(() => {
    initParticlesEngine(async (engine) => {
        await loadSlim(engine);
    }).then(() => {
        setInit(true);
    });
  }, []);

    const calculateFaceLocation = data => {
        const clarifaiFace  = data.outputs[0].data.regions;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        const boxes = [];

        clarifaiFace.forEach(face => {
            const box = face.region_info.bounding_box;

            boxes.push({
                leftCol: (1 + box.left_col) * width,
                topRow: box.top_row * height,
                rightCol: width - (box.right_col * width) + width,
                bottomRow: height - (box.bottom_row * height)
            });
        });

        setBox(boxes);
        return boxes;
        }

        const displayFaceBox = box => {
        setBox(box)
    }

  const onInputChange = e => {
    setImageUrl(e.target.value);
  }   
  
  const onButtonSubmit = () => {

    fetch('http://localhost:3000/imageApi', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: imageUrl
    })
        .then(response => response.json())
        .then(response => {
            if (response) { 
                fetch('http://localhost:3000/image', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: user.id
                    })
                })
                    .then(response => response.json())
                    .then(count => {
                        setUser({
                            ...user,
                            entries: count
                        })
                    })
                    .catch(console.log);
            }
            displayFaceBox(calculateFaceLocation(response))
        })
        .catch(console.log)
  }

  const onRouteChange = route => {
    if (route === 'signout') {
        setImageUrl('');
        setBox([]);
        setUser({
            id: '',
            name: '', 
            email: '',
            entries: 0,
            joined: ''
        })
    }
    else if (route === 'home') {
        setIsSignedIn(true);
    }
    setRoute(route);
  }

  const loadUser = data => {
    const { id, name, email, entries, joined } = data;
    setUser({
        id,
        name,
        email,
        entries,
        joined 
    })
  }

  return (
    <div className="App">
      { init && <Particles
            id="tsparticles"
            className="particles"
            options={{
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 100,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 0.3,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 400,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
}
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
      {
        route === 'home' 
        ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        : (
            route === 'signin' 
            ? <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />
            : <Register loadUser={loadUser} onRouteChange={onRouteChange} />
        )
      }
    </div>
  );
}

export default App;