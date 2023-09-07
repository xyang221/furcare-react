import React, {useState, useEffect} from 'react'
import axiosClient from '../axios-client';


const SearchBar = () => {

    const [searchInput, setSearchInput] = useState("");
    const [petowners, setPetowners] = useState([]);
    const [loading, setLoading] = useState(false);

 const getPetowners = () => {

    document.title = "Pet Owners";
    
    setLoading(true);
    axiosClient.get('/pet_owners')
        .then(({ data }) => {
            setLoading(false);
            setPetowners(data.data);
        })
        .catch(() => {
            setLoading(false);
        });


};

const handleChange = (e) => {
  e.preventDefault();
  setSearchInput(e.target.value);
};

const filteredPetowners = petowners.filter((p) =>
        p.name.toLowerCase().includes(searchInput.toLowerCase())
    );

console.log(petowners)
useEffect(() => {
    getPetowners();
}, []);

return (
    <div>
        <div className="default-form animated fadeInDown">
            <div className="form">
                <div className="card animated fadeInDown">
                <input
                    type="search"
                    placeholder="Search here"
                    onChange={handleChange}
                    value={searchInput} />
                   
                   <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            {loading && (
                                <tbody>
                                    <tr>
                                        <td colSpan={5}>Loading...</td>
                                    </tr>
                                </tbody>
                            )}
                            {!loading && (
                                <tbody>
                                    {filteredPetowners.map(po => (
                                        <tr key={po.id}>
                                            <td>{`${po.firstname} ${po.lastname}`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>
                </div>
            </div>
        </div>
    </div>
);


};

export default SearchBar;