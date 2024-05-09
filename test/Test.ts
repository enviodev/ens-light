import assert from "assert";
import { 
  TestHelpers,
  EventsSummaryEntity,
  ETHRegistrarController_NameRegisteredEntity
} from "generated";
const { MockDb, ETHRegistrarController, Addresses } = TestHelpers;

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  eTHRegistrarController_NameRegisteredCount: BigInt(0),
  eTHRegistrarController_NameRenewedCount: BigInt(0),
};

describe("ETHRegistrarController contract NameRegistered event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock ETHRegistrarController contract NameRegistered event
  const mockETHRegistrarControllerNameRegisteredEvent = ETHRegistrarController.NameRegistered.createMockEvent({
    name: "foo",
    label: "foo",
    owner: Addresses.defaultAddress,
    cost: 0n,
    expires: 0n,
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = ETHRegistrarController.NameRegistered.processEvent({
    event: mockETHRegistrarControllerNameRegisteredEvent,
    mockDb: mockDbFinal,
  });

  it("ETHRegistrarController_NameRegisteredEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualETHRegistrarControllerNameRegisteredEntity = mockDbUpdated.entities.ETHRegistrarController_NameRegistered.get(
      mockETHRegistrarControllerNameRegisteredEvent.transactionHash +
        mockETHRegistrarControllerNameRegisteredEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedETHRegistrarControllerNameRegisteredEntity: ETHRegistrarController_NameRegisteredEntity = {
      id:
        mockETHRegistrarControllerNameRegisteredEvent.transactionHash +
        mockETHRegistrarControllerNameRegisteredEvent.logIndex.toString(),
      name: mockETHRegistrarControllerNameRegisteredEvent.params.name,
      label: mockETHRegistrarControllerNameRegisteredEvent.params.label,
      owner: mockETHRegistrarControllerNameRegisteredEvent.params.owner,
      cost: mockETHRegistrarControllerNameRegisteredEvent.params.cost,
      expires: mockETHRegistrarControllerNameRegisteredEvent.params.expires,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualETHRegistrarControllerNameRegisteredEntity, expectedETHRegistrarControllerNameRegisteredEntity, "Actual ETHRegistrarControllerNameRegisteredEntity should be the same as the expectedETHRegistrarControllerNameRegisteredEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      eTHRegistrarController_NameRegisteredCount: MOCK_EVENTS_SUMMARY_ENTITY.eTHRegistrarController_NameRegisteredCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual ETHRegistrarControllerNameRegisteredEntity should be the same as the expectedETHRegistrarControllerNameRegisteredEntity");
  });
});
