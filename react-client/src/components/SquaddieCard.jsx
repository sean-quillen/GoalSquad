import React from 'react';
import ModalActions, { Card, Modal, Image, Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as squaddieActions from '../actions/squaddieActions';

const styles = {
  cardBackground: 'linear-gradient(to bottom, #faedc4, #ffebd8, #ffeff1, #fff8ff, #ffffff)',
};

class SquaddieCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      yardstatus: false,
      rename: false,
      newName: '',
    };
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.closeRename = this.closeRename.bind(this);
    this.saveRename = this.saveRename.bind(this);
  }

  toggleSquaddieToYard(monID) {
    this.setState({ yardstatus: !this.state.yardstatus });
    this.props.squaddieActions.toggleYardStatus(monID);
  }

  saveRename() {
    const { squaddie } = this.props;
    if (this.state.newName) {
      this.props.squaddieActions.changeName(squaddie.user.user_monster_id, this.state.newName);
      squaddie.user.user_monster_new_name = this.state.newName;
      this.closeRename();
    } else {
      alert('please enter a new name for your squaddie!');
    }
  }

  show(dimmer, size) { this.setState({ dimmer, size, open: true }); }
  close() { this.setState({ open: false }); }
  closeRename() { this.setState({ rename: false }); }

  render() {
    const {
      open, dimmer, size, yardstatus, rename,
    } = this.state;
    const { squaddie } = this.props;
    return (

      <Modal
        trigger={
          <Card
            color="orange"
            raised
            image={squaddie.user ? squaddie.monster_icon : './assets/misc/logo.png'}
            description={squaddie.user ?
              squaddie.user.user_monster_new_name || squaddie.monster_name
              :
              squaddie.monster_name}
            onClick={() => this.show(true, 'tiny')}
            className="squaddieicon"
          />
        }
        className="slideInDown"
        style={{ background: 'transparent', boxShadow: 'none' }}
        size={size}
        dimmer={dimmer}
        open={open}
        onClose={this.close}
      >
        <Modal.Content style={{ background: 'transparent' }}>
          <Card centered>
            <Image
              src={squaddie.user ? squaddie.monster_pic : './assets/misc/logo.png'}
              style={{ backgroundImage: styles.cardBackground }}
            />
            <Card.Content>
              <Card.Header>
                {squaddie.user ?
                  squaddie.user.user_monster_new_name || squaddie.monster_name
                  :
                  squaddie.monster_name}
                {squaddie.user ?
                  <Button size="mini" style={{ marginLeft: '5px' }} onClick={() => { this.setState({ rename: true }); }}>
                  Edit
                  </Button>
                  :
                  <div />}
              </Card.Header>
              <Card.Description>
                {squaddie.user ? squaddie.monster_description : 'Complete goals to unlock this monster!'}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              { squaddie.user ?
                <Button
                  inverted
                  floated="right"
                  color={yardstatus ? 'red' : 'green'}
                  content={yardstatus ? 'Remove From Yard' : 'Add to Yard'}
                  onClick={() => { this.toggleSquaddieToYard(this.props.squaddie.user.user_monster_id); }}
                /> : <div />
              }
            </Card.Content>
          </Card>
        </Modal.Content>
        <Modal
          style={{ background: 'transparent', boxShadow: 'none' }}
          size={size}
          dimmer={dimmer}
          open={rename}
          onClose={this.closeRename}
        >
          <Modal.Content>
            <Modal.Header> Rename squaddie </Modal.Header>
            <Input
              placeholder={squaddie.monster_name}
              value={this.state.newName}
              onChange={(event) => { this.setState({ newName: event.target.value }); }}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeRename}> Cancel </Button>
            <Button onClick={this.saveRename}> Save </Button>
          </Modal.Actions>
        </Modal>
      </Modal>
    );
  }
}

SquaddieCard.propTypes = {
  squaddieActions: PropTypes.objectOf(PropTypes.func).isRequired,
  squaddie: PropTypes.shape({
    monster_id: PropTypes.number,
    monster_name: PropTypes.string,
    monster_pic: PropTypes.string,
    monster_description: PropTypes.string,
    monster_icon: PropTypes.string,
  }).isRequired,
};

const mapDispatchToProps = dispatch => (
  {
    squaddieActions: bindActionCreators(squaddieActions, dispatch),
  }
);

export default connect(null, mapDispatchToProps)(SquaddieCard);
