import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

// Explicitly import marker images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationMarker = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapPickerModal = ({ open, onClose, onSelect, initialLatLng }) => {
  const [latLng, setLatLng] = useState(initialLatLng || [19.076, 72.8777]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Location</DialogTitle>
      <DialogContent>
        <div style={{ height: "400px", width: "100%" }}>
          <MapContainer
            center={latLng}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            <LocationMarker setLatLng={setLatLng} />
            <Marker position={latLng} />
          </MapContainer>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onSelect(latLng);
            onClose();
          }}
          variant="contained"
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MapPickerModal;
