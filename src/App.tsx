import React, { useEffect, useState, useRef } from 'react';
import { 
  Volume2, 
  Play, 
  Pause,
  Music,
  Radio,
  Zap,
  Waves,
  Headphones,
  Speaker,
  Mic,
  ArrowDown,
  Instagram,
  Twitter,
  Youtube,
  SkipBack,
  SkipForward
} from 'lucide-react';

function App() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Audio tracks with actual audio files
  const audioTracks = [
    { 
      name: "Ethereal Waves", 
      artist: "Sound Designer", 
      duration: "3:42",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    { 
      name: "Digital Dreams", 
      artist: "Audio Artist", 
      duration: "4:15",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    { 
      name: "Sonic Landscape", 
      artist: "Music Producer", 
      duration: "5:23",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    }
  ];

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Auto-play next track
      if (currentTrack < audioTracks.length - 1) {
        setCurrentTrack(prev => prev + 1);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, audioTracks.length]);

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = audioTracks[currentTrack].url;
      audio.volume = volume;
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    }
  }, [currentTrack, audioTracks, volume]);

  // Play/pause functionality
  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      // Fallback to a more reliable audio source
      audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmHgU7k9n1unEiBC13yO/eizEIHWq+8+OWT";
    }
  };

  // Track navigation
  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % audioTracks.length);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + audioTracks.length) % audioTracks.length);
    setCurrentTime(0);
  };

  // Seek functionality
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Format time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const visualElements = [
    {
      title: "Immersive Audio",
      description: "Experience sound in its purest form with cutting-edge audio technology",
      image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Studio Quality",
      description: "Professional-grade equipment for creators and audiophiles",
      image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Wireless Freedom",
      description: "Unleash your creativity without the constraints of cables",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Orbs */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
            style={{
              width: `${50 + Math.random() * 100}px`,
              height: `${50 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Sound Wave Lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="flex space-x-2">
            {[...Array(80)].map((_, i) => (
              <div
                key={`wave-${i}`}
                className="w-0.5 bg-gradient-to-t from-blue-400 via-purple-400 to-pink-400 rounded-full"
                style={{
                  height: `${30 + Math.random() * 120}px`,
                  animation: `wave ${0.8 + Math.random() * 1.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.03}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section with Stunning Banner */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Audio Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-purple-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Animated Audio Visualizer */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center space-x-1 opacity-30">
          {[...Array(60)].map((_, i) => (
            <div
              key={`viz-${i}`}
              className={`w-2 bg-gradient-to-t from-blue-400 to-purple-400 rounded-t-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
              style={{
                height: `${20 + Math.random() * 80}px`,
                animation: isPlaying ? `visualizer ${0.5 + Math.random() * 1}s ease-in-out infinite alternate` : 'none',
                animationDelay: `${i * 0.02}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Floating Badge */}
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">{isPlaying ? 'Now Playing' : 'Ready to Play'}</span>
            <Volume2 className="w-4 h-4 text-blue-400" />
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none">
            <span className="block bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-pulse-slow">
              SONIC
            </span>
            <span className="block text-5xl md:text-7xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-4">
              UNIVERSE
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Dive into an immersive world where sound becomes art and technology meets creativity
          </p>
          
          {/* Interactive Play Button */}
          <div className="flex flex-col items-center space-y-8">
            <button 
              onClick={togglePlayPause}
              className="group relative w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-blue-500/25"
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-opacity duration-300 ${isPlaying ? 'animate-ping opacity-20' : 'opacity-0'}`} />
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white ml-1" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{isPlaying ? 'Now Playing:' : 'Ready to Play:'}</span>
              <span className="text-white font-medium">{audioTracks[currentTrack].name}</span>
              <span>by {audioTracks[currentTrack].artist}</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-6 h-6 text-white/60" />
          </div>
        </div>
      </section>

      {/* Animated Gallery Section */}
      <section id="gallery" className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible.gallery ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Visual Symphony
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Where technology meets artistry in perfect harmony
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {visualElements.map((element, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-3xl transform transition-all duration-1000 hover:scale-105 ${isVisible.gallery ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                <div className="aspect-[4/5] relative">
                  <img 
                    src={element.image}
                    alt={element.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Animated Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl font-bold mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {element.title}
                    </h3>
                    <p className="text-gray-300 text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {element.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Audio Controls Section */}
      <section id="controls" className="py-32 px-4 bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible.controls ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Audio Control
              </span>
            </h2>
          </div>

          <div className={`bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-12 border border-gray-700/50 transform transition-all duration-1000 ${isVisible.controls ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {/* Equalizer Visualization */}
            <div className="flex justify-center items-end space-x-2 mb-12 h-32">
              {[...Array(20)].map((_, i) => (
                <div
                  key={`eq-${i}`}
                  className={`w-4 bg-gradient-to-t from-green-400 via-blue-400 to-purple-400 rounded-t-full transition-all duration-300 ${isPlaying ? '' : 'opacity-50'}`}
                  style={{
                    height: `${30 + Math.random() * 70}%`,
                    animation: isPlaying ? `equalizer ${0.5 + Math.random() * 1}s ease-in-out infinite alternate` : 'none',
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>

            {/* Track Info */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2">{audioTracks[currentTrack].name}</h3>
              <p className="text-gray-400 text-lg">{audioTracks[currentTrack].artist}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div 
                className="w-full bg-gray-700 rounded-full h-2 mb-4 cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full relative transition-all duration-300"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              <button 
                onClick={prevTrack}
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={togglePlayPause}
                className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button 
                onClick={nextTrack}
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center space-x-4">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-400 w-8">{Math.round(volume * 100)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Features Grid */}
      <section id="features" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Sound Innovation
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Headphones className="w-12 h-12" />, title: "Premium Audio", color: "from-blue-500 to-cyan-500" },
              { icon: <Speaker className="w-12 h-12" />, title: "Spatial Sound", color: "from-purple-500 to-pink-500" },
              { icon: <Mic className="w-12 h-12" />, title: "Studio Quality", color: "from-green-500 to-emerald-500" },
              { icon: <Radio className="w-12 h-12" />, title: "Wireless Tech", color: "from-orange-500 to-red-500" }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800 hover:border-gray-600 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"
                     style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${feature.color} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-gray-800 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 flex items-center justify-center space-x-3">
              <Waves className="w-10 h-10 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sonic Universe
              </span>
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Exploring the infinite possibilities of sound and technology
            </p>
          </div>
          
          <div className="flex justify-center space-x-8 mb-12">
            {[Instagram, Twitter, Youtube].map((Icon, index) => (
              <div
                key={index}
                className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group"
              >
                <Icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
          
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Sonic Universe. Crafted with passion for audio excellence.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }

        @keyframes wave {
          0% { height: 30px; }
          100% { height: 120px; }
        }

        @keyframes visualizer {
          0% { height: 20px; }
          100% { height: 100px; }
        }

        @keyframes equalizer {
          0% { height: 30%; }
          100% { height: 90%; }
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

export default App;