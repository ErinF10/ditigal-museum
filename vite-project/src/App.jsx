import React, { useState, useEffect } from 'react';
import './App.css';
import Painting from '../Components/Painting';
import BanBar from '../Components/BanBar';

function App() {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannedAttributes, setBannedAttributes] = useState([]);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await fetch('https://api.harvardartmuseums.org/exhibition?apikey=66cf4b76-f75f-4000-8c19-47ecb66b2d32&size=100&venue=HAM&fields=primaryimageurl,title,venues,people,status,lastupdate');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('API response:', data.records);

        const exhibitionsWithImages = data.records.filter(
          exhibition => exhibition.primaryimageurl || exhibition.poster?.imageurl
        );

        setExhibitions(exhibitionsWithImages);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const isExhibitionBanned = (exhibition) => {
    const attributes = [
      exhibition.venues?.[0]?.name,
      exhibition.people?.[0]?.name,
      exhibition.lastupdate
    ].filter(Boolean);

    return attributes.some(attr => 
      bannedAttributes.some(bannedAttr => 
        attr.toLowerCase().includes(bannedAttr.toLowerCase())
      )
    );
  };

  const getNextValidExhibition = () => {
    let nextIndex = currentIndex;
    let loopCount = 0;
    do {
      nextIndex = (nextIndex + 1) % exhibitions.length;
      loopCount++;
    } while (isExhibitionBanned(exhibitions[nextIndex]) && loopCount < exhibitions.length);

    if (loopCount < exhibitions.length) {
      return nextIndex;
    }
    return -1; // Indicates all exhibitions are banned
  };

  const handleDiscover = () => {
    const nextIndex = getNextValidExhibition();
    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
    } else {
      console.log("All exhibitions are banned");
      // You can add some UI feedback here
    }
  };

  const handleBan = (attribute) => {
    if (!bannedAttributes.includes(attribute)) {
      setBannedAttributes([...bannedAttributes, attribute]);
    }
  };

  const handleUnban = (attribute) => {
    setBannedAttributes(bannedAttributes.filter(attr => attr !== attribute));
  };

  useEffect(() => {
    // Check if the current exhibition is banned after bannedAttributes changes
    if (exhibitions.length > 0 && isExhibitionBanned(exhibitions[currentIndex])) {
      const nextIndex = getNextValidExhibition();
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
      }
    }
  }, [bannedAttributes]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (exhibitions.length === 0) return <div>No exhibitions with images found.</div>;

  const currentExhibition = exhibitions[currentIndex];

  return (
    <>
      <h1>Welcome to your digital museum!</h1>
      <h3>View our most esteemed exhibitions:</h3>
      
      {!isExhibitionBanned(currentExhibition) ? (
        <Painting
          key={currentExhibition.id}
          image={currentExhibition.primaryimageurl || currentExhibition.poster?.imageurl}
          title={currentExhibition.title || 'No Title specified'}
          venue={currentExhibition.venues?.[0]?.name || 'No venue specified'}
          people={currentExhibition.people?.[0]?.name || 'No person specified'}
          last_update={currentExhibition.lastupdate || 'No last update specified'}
          onDiscover={handleDiscover}
          onBan={handleBan}
        />
      ) : (
        <div>Current exhibition is banned. Click Discover to see the next one.</div>
      )}
      <BanBar bannedAttributes={bannedAttributes} onUnban={handleUnban} />
    </>
  );
}

export default App;