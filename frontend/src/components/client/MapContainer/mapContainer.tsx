import React, { useEffect, useRef, useState } from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';
import OpenCage from "opencage-api-client";
import thirdPartyAPIService from '../../../services/shared/third-party.service';

const libraries: 'places'[] = ['places'];

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapContainerProps {
  apiKey: string;
  addressString: string;
  zoom?: number;
}

const MapContainer: React.FC<MapContainerProps> = ({ apiKey, addressString, zoom = 15 }) => {
  
  const mapRef = useRef<any>(null);
  const [ openCageApiKey, setOpenCageApiKey ] = useState<string | undefined>(undefined);
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);

  const handleLoad = (map: any) => {
    mapRef.current = map;
  };

  useEffect(() => {
    const geocode = async () => {
      if (!addressString.trim()) return;

      try {
        const response = await thirdPartyAPIService.getOpenCageAPI();
        if (response?.code === 200) {
          setOpenCageApiKey(response.apiKey);
          const { results } = await OpenCage.geocode({ key: response.apiKey, q: addressString });
          if (results?.length > 0) {
            const { lat, lng } = results[0].geometry;
            setCoordinate({ latitude: lat, longitude: lng });
          }
        } else {
          console.log('Error occurred while getting OpenCage API key');
        }
      } catch (err) {
        console.error(err);
      }
    };

    geocode();
  }, [addressString]);

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
    >
      {coordinate && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '30rem' }}
          zoom={zoom}
          center={{ lat: coordinate.latitude, lng: coordinate.longitude }}
          onLoad={handleLoad}
        />
      )}
    </LoadScript>
  );
};

export default MapContainer;
