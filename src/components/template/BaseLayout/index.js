import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const BaseLayout = ({
  title = 'Title',
  col = 12,
  className,
  children,
}) => {
  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col className="mt-4" xs md lg={col}>
            <h2 className="text-center">{title}</h2>
            <div className={className}>{children}</div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BaseLayout;
