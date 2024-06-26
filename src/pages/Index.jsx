import React, { useState, useEffect } from "react";
import { Container, Input, Button, VStack, HStack, Select, Text, Box, SimpleGrid } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const mockData = [
  { id: 1, title: "Item 1", price: 100, location: "Warsaw", url: "https://www.olx.pl/item1" },
  { id: 2, title: "Item 2", price: 200, location: "Krakow", url: "https://www.olx.pl/item2" },
  { id: 3, title: "Item 3", price: 50, location: "Gdansk", url: "https://www.olx.pl/item3" },
  // Add more mock items as needed
];

const Index = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("https://www.olx.pl/api/locations");
        const data = await response.json();
        setLocations(data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const handleSearch = () => {
    // Simulate fetching data from OLX and sorting by price
    const filteredData = mockData.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) && item.location.toLowerCase().includes(location.toLowerCase())).sort((a, b) => a.price - b.price);

    setResults(filteredData);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <HStack width="100%">
          <Input placeholder="Search for items" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)}>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </Select>
          <Select placeholder="Distance" value={distance} onChange={(e) => setDistance(e.target.value)}>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="20">20 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
          </Select>
          <Button size="lg" colorScheme="teal" onClick={handleSearch}>
            Szukaj
          </Button>
        </HStack>
        {results.length === 0 ? (
          <Text fontSize="xl" color="red.500">
            Nie znaleziono
          </Text>
        ) : (
          <SimpleGrid columns={1} spacing={4} width="100%">
            {paginatedResults.map((item) => (
              <Box key={item.id} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontSize="xl">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </Text>
                <Text>Price: {item.price} PLN</Text>
                <Text>Location: {item.location}</Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
        <HStack spacing={2}>
          {Array.from({ length: Math.ceil(results.length / itemsPerPage) }, (_, i) => (
            <Button key={i + 1} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </Button>
          ))}
        </HStack>
      </VStack>
    </Container>
  );
};

export default Index;
