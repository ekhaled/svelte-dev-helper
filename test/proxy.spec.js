/* global describe, it */
const chai = require('chai');
const sinonChai = require('sinon-chai');
const { spy } = require('sinon');

const { configure, getConfig, Registry, createProxy } = require('../index');
const Component = require('./fixtures/mockComponent').default;

chai.use(sinonChai);
const { expect } = chai;

describe('Config', function() {

  configure({ x: 'y' });

  it('allows configuration', function() {
    let config = getConfig();
    expect(config.noPreserveState).to.be.false;

    configure({ noPreserveState: true });
    config = getConfig();
    expect(config.noPreserveState).to.be.true;

    configure({ noPreserveState: true });
  });

});

describe('Proxy', function() {

  const id = 'fixtures/MockComponent.html';
  const allMethods = 'get,fire,observe,on,set,teardown,_recompute,_set,_mount,_unmount,destroy,_register,_rerender'.split(',');
  const allProps = '_fragment,_slotted,root,store'.split(',');

  const SpiedComponent = spy(Component);

  Registry.set(id, {
    rollback: null,
    component: SpiedComponent,
    instances: []
  });

  const Wrapped = createProxy(id),
    wrappedComponent = new Wrapped({});

  const methodSpies = {};
  allMethods.forEach((method) => { methodSpies[method] = spy(wrappedComponent, method); });

  it('should contain the right component and instance in Registry', function() {
    const item = Registry.get(id);
    expect(item.component).to.eq(SpiedComponent);
    expect(item.instances[0]).to.eq(wrappedComponent);
  });

  it('Underlying component gets constructed when proxy is constructed', function() {
    expect(SpiedComponent).to.be.calledOnce;
    expect(wrappedComponent.proxyTarget).to.be.instanceOf(SpiedComponent);
  });

  it('wrapped component contains right props', function() {

    allProps.forEach((prop) => {
      expect(wrappedComponent[prop]).not.to.be.undefined;
      expect(wrappedComponent[prop]).to.eq(wrappedComponent.proxyTarget[prop]);
    });

    expect(wrappedComponent._debugName).to.eq('<MockComponent>');
    expect(wrappedComponent.id).to.eq(id);

  });

  it('wrapped component contains right methods', function() {

    allMethods.forEach((prop) => {
      expect(typeof wrappedComponent[prop]).to.eq('function');
    });

  });

  it('wrapped component mounts properly', function() {
    expect(wrappedComponent.__mounted).to.be.false;

    // eslint-disable-next-line no-undef
    wrappedComponent._mount(document.body);
    expect(methodSpies._mount).to.be.calledOnce;

    expect(wrappedComponent.__mounted).to.be.true;
    expect(wrappedComponent.__insertionPoint.__component__).to.eq(wrappedComponent);
  });

  it('removes itself from Registry and cleans up on destruction', function() {

    wrappedComponent._unmount();
    expect(methodSpies._unmount).to.be.calledOnce;

    expect(wrappedComponent.__mounted).to.be.false;

    wrappedComponent.destroy();
    expect(methodSpies.destroy).to.be.calledOnce;

    expect(wrappedComponent.__insertionPoint.__component__).to.be.null;


    const item = Registry.get(id);
    expect(item.component).to.eq(SpiedComponent);
    expect(item.instances[0]).to.be.undefined;
    expect(item.instances.length).to.eq(0);
  });

});