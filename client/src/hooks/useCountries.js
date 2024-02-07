import countries from 'world-countries'

const formatedCountries = countries.map(country => ({
    value: country.cca2,
    label: country.name.common,
    flag: country.flag,
    lating: country.latlng,
    region: country.region
}))

const useCountries = () => {
    const getAll = () => {
        return formatedCountries
    }
    const getByValue = (value) => {
        return formatedCountries.find((item) => item.value === value)
    }
    return {
        getAll,
        getByValue
    }
}

export default useCountries