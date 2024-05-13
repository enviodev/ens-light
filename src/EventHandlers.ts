import { ETHRegistrarControllerContract, EnsHandleEntity } from "generated";

ETHRegistrarControllerContract.NameRegistered.loader(
  ({ event, context }) => {}
);

ETHRegistrarControllerContract.NameRegistered.handler(({ event, context }) => {
  const name = event.params.name.replace(/\u0000/g, "").slice(0, 255);

  const ensHandle: EnsHandleEntity = {
    id: name,
    label: event.params.label,
    owner: event.params.owner,
    cost: event.params.cost,
    expires: event.params.expires,
  };

  context.EnsHandle.set(ensHandle);
});

ETHRegistrarControllerContract.NameRenewed.loader(({ event, context }) => {
  context.EnsHandle.load(
    event.params.name.replace(/\u0000/g, "").slice(0, 255)
  );
});

ETHRegistrarControllerContract.NameRenewed.handler(({ event, context }) => {
  const name = event.params.name.replace(/\u0000/g, "").slice(0, 255);

  const ensHandle = context.EnsHandle.get(name);

  if (ensHandle === undefined) {
    // it seems some expiration events are emitted before the registration event?
    // todo dig into
    // throw new Error(`Can't renew an EnsHandle that doesn't exist: ${name}`);
  } else {
    context.EnsHandle.set({
      ...ensHandle,
      expires: event.params.expires,
    });
  }
});
