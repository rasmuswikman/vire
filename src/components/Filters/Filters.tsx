import React from 'react';
import { AggregationFragment } from '../../generated/types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Props = {
  aggregations: Array<AggregationFragment | null | undefined>;
  handleAggregations: (options: Record<string, Record<string, boolean>>) => void;
};

export default function Filters(props: Props) {
  const { aggregations, handleAggregations } = props;

  const [options, setOptions] = React.useState<
    Record<string, Record<string, boolean>>
  >({});
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    attributeCode: string,
  ) => {
    const newOptions = {
      ...options,
      [attributeCode]: {
        ...options[attributeCode],
        [event.currentTarget.name]: Boolean(event.target.checked),
      },
    };
    setOptions(newOptions);
    handleAggregations(newOptions);
  };

  return (
    <Box>
      {aggregations.map(
        (aggregation) =>
          aggregation &&
          aggregation.options && (
            <Accordion disableGutters key={aggregation.attribute_code}>
              <AccordionSummary
                sx={{ p: 0 }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${aggregation.attribute_code}-content`}
              >
                <Typography>{aggregation.label}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  {aggregation.options.map(
                    (option) =>
                      option && (
                        <FormControlLabel
                          key={option.label}
                          control={
                            <Checkbox
                              name={option.value}
                              checked={
                                (options[aggregation.attribute_code] &&
                                  options[aggregation.attribute_code][
                                    option.value
                                  ]) ??
                                false
                              }
                              onChange={(e) =>
                                handleChange(e, aggregation.attribute_code)
                              }
                            />
                          }
                          label={option.label ?? 'aggregation label'}
                        />
                      ),
                  )}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ),
      )}
    </Box>
  );
}
