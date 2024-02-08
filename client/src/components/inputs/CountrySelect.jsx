import Select from 'react-select';
import useCountries from '../../hooks/useCountries';

const CountrySelect = (props) => {

    const { value, onChange } = props;
    const { getAll } = useCountries();

    return (
        <div>
            <Select
                placeholder="Anywhere"
                isClearable
                options={getAll()}
                value={value}
                onChange={(value) => onChange(value)}
                formatOptionLabel={(option) => (
                  <div className="
                  flex flex-row items-center gap-3">
                    <div>{option.flag}</div>
                    <div>
                      {option.label},
                      <span className="text-neutral-500 ml-1">
                        {option.region}
                      </span>
                    </div>
                  </div>
                )}
            />
        </div>
    )
}

export default CountrySelect;