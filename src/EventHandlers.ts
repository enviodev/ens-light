import { ETHRegistrarControllerContract, EnsHandleEntity } from "generated";

ETHRegistrarControllerContract.NameRegistered.handlerAsync(
  async ({ event, context }) => {
    const name = event.params.name.replace(/\u0000/g, "").slice(0, 255);

    const ensHandle: EnsHandleEntity = {
      id: name,
      label: event.params.label,
      owner: event.params.owner,
      cost: event.params.cost,
      expires: event.params.expires,
    };

    context.EnsHandle.set(ensHandle);
  }
);

ETHRegistrarControllerContract.NameRenewed.handlerAsync(
  async ({ event, context }) => {
    const name = event.params.name.replace(/\u0000/g, "").slice(0, 255);

    const ensHandle = await context.EnsHandle.get(name);

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
  }
);
