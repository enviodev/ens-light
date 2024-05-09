/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  ETHRegistrarControllerContract,
    ETHRegistrarController_NameRegisteredEntity,
    ETHRegistrarController_NameRenewedEntity,
EventsSummaryEntity
} from "generated";

export const GLOBAL_EVENTS_SUMMARY_KEY = "GlobalEventsSummary";

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
    eTHRegistrarController_NameRegisteredCount: BigInt(0),
    eTHRegistrarController_NameRenewedCount: BigInt(0),
};

    ETHRegistrarControllerContract.NameRegistered.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

    ETHRegistrarControllerContract.NameRegistered.handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    eTHRegistrarController_NameRegisteredCount: currentSummaryEntity.eTHRegistrarController_NameRegisteredCount + BigInt(1),
  };

  const eTHRegistrarController_NameRegisteredEntity: ETHRegistrarController_NameRegisteredEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      name: event.params.name      ,
      label: event.params.label      ,
      owner: event.params.owner      ,
      cost: event.params.cost      ,
      expires: event.params.expires      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ETHRegistrarController_NameRegistered.set(eTHRegistrarController_NameRegisteredEntity);
});
    ETHRegistrarControllerContract.NameRenewed.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

    ETHRegistrarControllerContract.NameRenewed.handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity =
    summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    eTHRegistrarController_NameRenewedCount: currentSummaryEntity.eTHRegistrarController_NameRenewedCount + BigInt(1),
  };

  const eTHRegistrarController_NameRenewedEntity: ETHRegistrarController_NameRenewedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
      name: event.params.name      ,
      label: event.params.label      ,
      cost: event.params.cost      ,
      expires: event.params.expires      ,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ETHRegistrarController_NameRenewed.set(eTHRegistrarController_NameRenewedEntity);
});
