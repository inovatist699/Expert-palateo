[graphify] MultiDiGraph edge-collapse diagnostic
input: <in-memory>
input_stage: provided JSON (normal graph.json is post-build)
effective_directed: <direct-call>
nodes: 213
unverified_code_nodes: 0
raw_edges: 237
valid_candidate_edges: 231
missing_endpoint_edges: 0
dangling_endpoint_edges: 0
external_reference_edges: 6
self_loop_edges: 0
exact_duplicate_edges: 0
directed_unique_endpoint_pairs: 225
directed_same_endpoint_collapsed_edges: 6
undirected_unique_endpoint_pairs: 225
undirected_same_endpoint_collapsed_edges: 6
same_endpoint_group_count: 6
relation_variant_groups: 6
source_file_variant_groups: 0
source_location_variant_groups: 0
context_variant_groups: 0
post_build_graph_type: DiGraph
post_build_edges: 231
producer_suppression_sites: 12
producer_suppression_examples:
  - L1749 seen_ids arity=unknown
  - L2282 seen_ids arity=unknown
  - L2284 seen_doc_refs arity=unknown
  - L2762 seen_ids arity=unknown
  - L2909 seen_ids arity=unknown
  - L3708 seen_keys arity=unknown
  - L3881 seen_keys arity=unknown
  - L6088 seen_ids arity=unknown
examples:
  - src_features_place_controller -> src_features_place_controller_closeplacedetails edges=2 relations=['calls', 'contains'] locations=['L10', 'L18'] contexts=['', 'call']
  - src_services_supabase_client -> src_services_supabase_client_connectbackend edges=2 relations=['contains', 'indirect_call'] locations=['L18', 'L27'] contexts=['', 'collection']
  - src_app_events -> src_app_events_focusplacepreview edges=2 relations=['calls', 'contains'] locations=['L2', 'L35'] contexts=['', 'call']
  - src_app_events -> src_app_events_closeplacepreview edges=2 relations=['calls', 'contains'] locations=['L10', 'L35'] contexts=['', 'call']
  - src_shared_ui_brand_animation_initlogoreveal -> src_shared_ui_brand_animation_initlogoreveal_dismiss edges=2 relations=['calls', 'contains'] locations=['L19', 'L5'] contexts=['', 'call']
note: normal graph.json is post-build; raw producer loss must be measured earlier.