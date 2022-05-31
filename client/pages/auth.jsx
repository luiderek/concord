import React from 'react';
import { Button } from 'react-bootstrap';

export default function Auth(props) {

  return (
    <>
      <h4 className='auth-header'> This is the auth page. I will be your guide. </h4>
      <div className="button-wrapper">
        <Button> One button will summon a modal. </Button>
        <Button> The other will destroy the world. </Button>
      </div>
    </>
  );
}
