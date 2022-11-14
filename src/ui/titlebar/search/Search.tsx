import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Fade,
  IconButton,
  InputBase,
  Paper,
  Portal,
  SvgIcon,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward, CgSearch, MdClear } from 'react-icons/all';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';
import { useSearch } from '../../../hooks/queryHooks';
import SearchResultBox from './SearchResultBox';

const Search = ({ searchContainer }: {searchContainer: React.RefObject<HTMLDivElement>}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const searchInput = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [inputDebounced, setInputDebounced] = useState('');
  const [inputHover, setInputHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: searchResults } = useSearch({ query: inputDebounced });

  useDebounce(() => {
    setInputDebounced(input);
    setLoading(false);
  }, 500, [input]);

  useEffect(() => {
    if (input.length === 0) {
      queryClient.setQueriesData(['search'], []);
      return;
    }
    setLoading(true);
  }, [input, queryClient]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
    setOpen(true);
  };

  const handleClear = () => {
    queryClient.setQueriesData(['search'], []);
    setInput('');
    searchInput.current?.focus();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <Box
      alignItems="center"
      display="flex"
      margin="auto"
      sx={{ WebkitAppRegion: 'no-drag' }}
      width={550}
    >
      <Box
        sx={{
          color: 'text.secondary',
          opacity: window.history.state.idx === 0 ? 0 : 1,
          pointerEvents: window.history.state.idx === 0 ? 'none' : 'auto',
          transition: '0.2s',
          '&:hover': {
            color: 'primary.main',
            transform: 'scale(1.2)',
            cursor: 'pointer',
          },
        }}
        title="Back"
        onClick={() => navigate(-1)}
      >
        <SvgIcon>
          <IoIosArrowBack />
        </SvgIcon>
      </Box>
      <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClickAway}>
        <Box
          height={40}
          maxWidth={502}
          sx={{
            willChange: 'transform',
          }}
          width="calc(40vw + 2px)"
        >
          <Paper
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              boxShadow: 'none',
            }}
            onMouseEnter={() => setInputHover(true)}
            onMouseLeave={() => setInputHover(false)}
          >
            <IconButton
              disableRipple
              sx={{
                m: '2px',
                p: '5px',
                pr: '7px',
                pl: '3px',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'text.primary',
                },
              }}
              onClick={() => searchInput.current?.focus()}
            >
              <SvgIcon><CgSearch /></SvgIcon>
            </IconButton>
            <InputBase
              fullWidth
              autoComplete="off"
              inputProps={{ maxLength: 35, spellCheck: false }}
              inputRef={searchInput}
              placeholder="Search"
              value={input}
              onBlur={() => null}
              onChange={handleChange}
              onFocus={handleFocus}
            />
            {inputHover && input.length !== 0 && !loading && (
            <IconButton
              disableRipple
              sx={{
                m: '2px',
                p: '5px',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'text.primary',
                },
              }}
              onClick={handleClear}
            >
              <SvgIcon><MdClear /></SvgIcon>
            </IconButton>
            )}
            {loading && (
            <CircularProgress
              size={24}
              sx={{
                my: 'auto', color: 'text.secondary', position: 'absolute', right: '8px',
              }}
            />
            )}
          </Paper>
          <Portal container={searchContainer.current}>
            <Fade in={open} style={{ transformOrigin: 'top' }} timeout={300}>
              <Box
                bgcolor="transparent"
                border="1px solid"
                borderColor="primary.main"
                borderRadius="4px"
                display="table"
                id="search-container"
                left={0}
                margin="auto"
                maxWidth="502px"
                position="absolute"
                right={0}
                sx={{
                  transform: 'scale(1,1) !important',
                }}
                top={4}
                width="calc(40vw + 2px)"
                zIndex={1300}
              >
                <Box
                  boxShadow="none !important"
                  component={Paper}
                >
                  <Box
                    borderBottom="1px solid"
                    borderColor="border.main"
                    boxShadow="none !important"
                    component={Paper}
                    height={38}
                    marginX="auto"
                    width="95%"
                  />
                  <SearchResultBox
                    query={inputDebounced}
                    results={searchResults}
                    setOpen={setOpen}
                  />
                </Box>
              </Box>
            </Fade>
          </Portal>
        </Box>
      </ClickAwayListener>
      <Box
        sx={{
          color: 'text.secondary',
          opacity: window.history.state.idx === window.history.length - 1 ? 0 : 1,
          pointerEvents: window.history.state.idx === window.history.length - 1 ? 'none' : 'auto',
          transition: '0.2s',
          '&:hover': {
            color: 'primary.main',
            transform: 'scale(1.2)',
            cursor: 'pointer',
          },
        }}
        title="Forward"
        onClick={() => navigate(1)}
      >
        <SvgIcon>
          <IoIosArrowForward />
        </SvgIcon>
      </Box>
    </Box>
  );
};

export default Search;
