import React from 'react';
import { connect } from 'react-redux';
import { StaticRouter, Route } from 'react-router';
import Legacy from './v0';
import Modern from './v1';

const PDF = ({ schemaVersion }) => {
  const Component = schemaVersion === 0 ? Legacy : Modern;
  return (
    <StaticRouter>
      <Route path="/" component={Component} />
    </StaticRouter>
  );
};

const mapStateToProps = ({ application: { schemaVersion } }) => ({ schemaVersion });

export default connect(mapStateToProps)(PDF);
