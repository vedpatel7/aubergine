import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import "./UniversitySearch.css";

const UniSearch = () => {
  const [country, setCountry] = useState("");
  const [universities, setUniversities] = useState([]);
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const cardRefs = useRef({});

  useEffect(() => {
    if (country) {
      searchUniversities();
    }
  }, [country]);

  const searchUniversities = async () => {
    try {
      const response = await fetch(`http://universities.hipolabs.com/search?country=${country}`);
      const data = await response.json();
      setUniversities(data);
      const allstate = data.map((uni) => uni["state-province"]);

      let uniquestate = [];

      for (let province of allstate) {
        if (province && !uniquestate.includes(province)) {
          uniquestate.push(province);
        }
      }

      uniquestate.unshift("All");
      setState(uniquestate);
      setSelectedState("All");
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const filteredUniversities = universities.filter(
    (uni) => selectedState === "All" || uni["state-province"] === selectedState
  );

  const downloadCard = async (index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const canvas = await html2canvas(card);
    const dataURL = canvas.toDataURL("image/jpeg");
    downloadjs(dataURL, "download.png", "image/png");
  };

  return (
    <Container>
      <div className="header">
        <TextField variant="outlined"
          label="Search your desired Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="search-input"/>
        <Button variant="contained" color="primary" onClick={searchUniversities} className="search-button" startIcon={<SearchIcon />}>
          Search
        </Button>
        <Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="province-dropdown">

          {state.map((province) => (
            <MenuItem key={province} value={province}>
              {province}
            </MenuItem>
          ))}

        </Select>
      </div>
      <div className="university-grid">
        {filteredUniversities.map((uni, index) => (
          <Card key={index}
            className="university-card"
            ref={(el) => (cardRefs.current[index] = el)}>
            <CardContent>
              <Typography variant="h5">{uni.name}</Typography>
              <Typography variant="body2">{uni["state-province"]}</Typography>
              <a href={uni.web_pages[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="university-link">
                Visit Website
              </a>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="secondary"
                onClick={() => downloadCard(index)}
                startIcon={<DownloadIcon />}>
                Download
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default UniSearch;
