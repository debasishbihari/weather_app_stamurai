import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&offset=${(page - 1) * 100}`
      );
      const newCities = response.data.results;
      setCities((prevCities) => [...prevCities, ...newCities]);
      setHasMore(newCities.length > 0);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <h2>Cities</h2>
      <InfiniteScroll
        dataLength={cities.length}
        next={fetchCities}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more cities to load</p>}
      >
        <table>
          <thead>
            <tr>
              <th>City Name</th>
              <th>Country</th>
              <th>Timezone</th>
              <th>Population</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {cities.length > 0 ? (
              cities.map((city) => (
                <tr key={city.geoname_id}>
                  <td>{city.ascii_name}</td>
                  <td>{city.cou_name_en}</td>
                  <td>{city.timezone}</td>
                  <td>{city.population}</td>
                  <td>{city.coordinates.lat}</td>
                  <td>{city.coordinates.lon}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No Cities Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default CitiesTable;
