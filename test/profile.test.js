const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app'); 

chai.use(chaiHttp);
const { expect } = chai;

describe('Profile API', () => {
  it('should return the profile data', (done) => {
    chai.request(app)
      .get('/1') 
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should create a new profile', (done) => {
    chai.request(app)
      .post('/profiles')
      .send({
        name: 'Isaac Orah',
          id: 1,
          description: 'Test',
          mbti: 'test',
          enneagram: 'test',
          variant: 'test',
          tritype: 1,
          socionics: 'test',
          sloan: 'test',
          psyche: 'test',
          image: 'https://soulverse.boo.world/images/1.png',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should add a comment to a profile', (done) => {
    const profileId = 1; // Adjust with the actual profile ID
    chai.request(app)
      .post(`/${profileId}/comments`)
      .send({
        text: 'Great profile!',
        user: 'isaac',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should add a vote to a profile', (done) => {
    const profileId = 1; // Adjust with the actual profile ID
    chai.request(app)
      .post(`/${profileId}/votes`)
      .send({
        value: 1
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        done();
      });
  });
});